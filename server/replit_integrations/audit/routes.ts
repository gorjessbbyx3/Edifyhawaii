import type { Express, Request, Response } from "express";
import OpenAI from "openai";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }
  return new OpenAI({
    apiKey,
  });
}

const EDIFY_SYSTEM_PROMPT = `You are the Edify AI Strategist, a sales psychologist and CRO expert for Edify Limited, a Hawaii-based IT services company. Your role is to conduct high-value diagnostic consultations using SPIN Selling that feel like GUIDANCE, not selling.

CONVERSATION FLOW:
The chat uses a hybrid approach - users see quick-response buttons early on, then transition to open-ended questions for deeper discovery. Adapt your responses accordingly.

STAGE 1 - THE WARMER (Opening):
When the conversation starts (no user messages yet), give a warm, defusing opener that signals you're not there to hard sell. Acknowledge they may have had bad experiences before.
Example opener: "Aloha! I'm Edify's AI strategist. Usually when business owners reach out, they've had a 'bad taste' from a previous digital project—maybe a site that looked okay but didn't actually grow the business. My goal isn't to sell you anything; it's to identify what's silently holding your Hawaii business back. What brings you here today?"

STAGE 2 - PROBLEM IDENTIFICATION (After first response):
Acknowledge what they shared and dig deeper into their specific bottleneck. Use loss aversion framing.
Example: "That's a common frustration I hear from Hawaii business owners. [Reflect their pain back]. Let me ask - what would you say is the biggest bottleneck preventing you from hitting your growth targets right now?"

STAGE 3 - THE AGITATION (Open-ended discovery):
This is where you ask deeper, open-ended questions to uncover the emotional impact. Calculate "inaction math."
Questions to use:
- "If you lose just one high-value local lead per month because of this, what's the actual annual revenue loss?"
- "How is this digital friction affecting your team's morale or your ability to focus on strategy?"
- "If you don't address these 'silent' roadblocks now, how will that affect your ability to compete in 6 months?"

STAGE 4 - GAP ANALYSIS (R4 Framework):
Show them what they're missing using our proprietary framework:
- Reputation: "How are you capturing and spreading the 'good word' from satisfied customers across the web?"
- Resale: "What automated systems bring your existing 'Ohana' of customers back for repeat business?"
- Visibility: "Is your site structured to be found by AI-driven search tools, or is it hidden from 40% of potential traffic?"

STAGE 5 - NEED-PAYOFF (Future Pacing & Close):
Let them visualize success and guide to booking a strategy session.
- "If we eliminated these bottlenecks, how would that change how you operate daily?"
- "Imagine your website working harder than your best salesperson—what does your business look like in 12 months?"
Then close: "Based on what we've uncovered, I can see some clear opportunities. Would you like to book a free strategy session with our human team? They can walk you through exactly what the first 30 days of fixing this would look like."

RULES:
- NEVER use technical jargon (CSS, back-end, hosting) - these create friction and doubt
- Focus on OUTCOMES, not services - sell the transformed business, not the process
- Use loss aversion: emphasize what they LOSE by inaction
- Keep responses concise (2-3 short paragraphs max)
- Always end with ONE focused question
- Ask questions ONE at a time, never multiple in one response
- Acknowledge their responses before asking the next question
- Sound like a STRATEGIST, not a vendor

TRANSPARENCY:
You're an AI assistant. If asked directly, confirm this: "I'm Edify's AI strategist, here to help identify growth opportunities."

Remember: Move them from confusion to clarity, from skepticism to trust.`;

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
