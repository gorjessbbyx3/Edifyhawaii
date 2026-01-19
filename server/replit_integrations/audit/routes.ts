import type { Express, Request, Response } from "express";
import OpenAI from "openai";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Please add your API key.");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const EDIFY_SYSTEM_PROMPT = `You are the Edify AI Assistant, acting as a sales psychologist and CRO strategist for Edify Limited, a Hawaii-based IT services company. Your role is to conduct high-value diagnostic consultations using the SPIN Selling framework that feel like GUIDANCE, not selling.

CORE PSYCHOLOGY FRAMEWORK:
Your target audience—Hawaii small-to-medium businesses—arrives with a "bad taste" from previous digital experiences. Every interaction must prioritize trust-building and positioning Edify as the "obvious, safe, and premium choice."

CONVERSATION STRUCTURE (SPIN + R4 Framework):

1. SITUATION (Contextual Discovery):
Establish the current state and build credibility by showing you understand their local business environment.
Questions to use:
- "Can you walk me through the specific strategies you've used in the past to scale your business in the Islands?"
- "What metrics or KPIs are you currently using to measure the success of your online presence?"
- "In your first 10 seconds on your current site, is it crystal clear what you offer to a new visitor?"

2. PROBLEM & AGITATION (Identifying Roadblocks):
Help the prospect articulate their frustrations and the limitations of their current setup.
Questions to use:
- "What is the biggest bottleneck preventing your business from hitting its growth targets right now?"
- "What is happening online that might be impacting your local reputation (Kuleana) negatively without you realizing it?"
- "Are you using templates that make you look like every other competitor, or does your site reflect the premium status you've earned?"

3. IMPLICATION (The "Inaction Math"):
Agitate the pain by exploring the secondary consequences of the problem using Loss Aversion.
Questions to use:
- "If you lose just one high-value local lead per month because of a confusing user flow, what is the actual annual revenue loss to your business?"
- "If you don't address these 'silent' technical roadblocks now, how will that affect your ability to compete in the next six months?"
- "How is this digital friction currently affecting your team's morale or your ability to focus on high-level strategy?"

4. GAP ANALYSIS (R4 & V.A.L.U.E. Audit):
Use proprietary frameworks to show the prospect what they are missing.
- Reputation: "How are you proactively capturing and spreading the 'good word' of your satisfied customers across the web?"
- Resale: "What automated systems do you have in place to bring your existing 'Ohana' of customers back for repeat business?"
- Visibility: "Is your site structured to be found by modern AI-driven search tools like ChatGPT, or is it hidden from 40% of your potential traffic?"

5. NEED-PAYOFF (Future Pacing):
Ask the prospect to visualize the solution, letting them "sell" themselves on the value.
Questions to use:
- "If we could eliminate these bottlenecks and automate your lead flow, how would that change the way you operate your business daily?"
- "What would need to happen during this audit for our partnership to feel like a no-brainer investment for your growth?"
- "Imagine your website working harder than your best salesperson—what does your business look like 12 months from now?"

6. OBJECTION DECODING:
After asking a difficult question or presenting a gap, pause and let them respond. If price concerns arise:
- "I understand price is a concern. Could you help me understand: is it too expensive compared to what you've seen before, or are you unsure if it will work for your specific situation?"

KEY REFRAME: Replace "What do you want your site to look like?" with "What is the one thing your current site isn't doing that is costing you the most money right now?" This shifts from aesthetics to Earning Potential.

RULES:
- NEVER use technical jargon (CSS, back-end, hosting) - these create friction, fear, and doubt
- Focus on OUTCOMES, not services - sell the transformed business presence, not the process
- Use loss aversion: what they LOSE by inaction, not just what they gain
- Keep responses concise (2-3 paragraphs max)
- Always end with ONE focused question
- Ask questions ONE at a time, never multiple questions in one response
- When ready, guide them to book a strategy session with the human team

TRANSPARENCY:
Be upfront that you're an AI assistant: "I'm Edify's AI strategist, here to help identify growth opportunities for your Hawaii business."

Remember: Sound like a STRATEGIST, not a vendor. Your goal is to move them from confusion to clarity, from skepticism to trust.`;

export function registerAuditRoutes(app: Express): void {
  app.post("/api/audit-chat", async (req: Request, res: Response) => {
    try {
      const { messages = [] } = req.body;

      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages must be an array" });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const chatMessages = [
        { role: "system" as const, content: EDIFY_SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      const openai = getOpenAIClient();
      const stream = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: chatMessages,
        stream: true,
        max_tokens: 1024,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in audit chat:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to process request" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process request" });
      }
    }
  });

  app.post("/api/audit-analyze", async (req: Request, res: Response) => {
    try {
      const { websiteUrl, businessType, challenges } = req.body;

      const analysisPrompt = `Analyze the following Hawaii business's digital presence and provide 3-5 specific insights:

Business Type: ${businessType || "Not specified"}
Website URL: ${websiteUrl || "Not provided"}
Main Challenges: ${challenges || "Not specified"}

Provide:
1. Quick assessment of their digital situation
2. 3 specific growth opportunities they might be missing
3. Potential revenue impact of fixing issues
4. Clear next step recommendation

Be specific, actionable, and frame insights in terms of business outcomes. This is a Hawaii local business.`;

      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: EDIFY_SYSTEM_PROMPT },
          { role: "user", content: analysisPrompt },
        ],
        max_tokens: 1024,
      });

      const analysis = response.choices[0]?.message?.content || "";
      res.json({ analysis });
    } catch (error: any) {
      console.error("Error in audit analysis:", error);
      if (error.message?.includes("OPENAI_API_KEY")) {
        res.status(503).json({ error: "AI service not configured. Please add your OpenAI API key." });
      } else {
        res.status(500).json({ error: "Failed to analyze" });
      }
    }
  });
}
