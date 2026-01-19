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

const EDIFY_SYSTEM_PROMPT = `You are the Edify AI Assistant, acting as a sales psychologist and CRO strategist for Edify Limited, a Hawaii-based IT services company. Your role is to conduct high-value diagnostic consultations that feel like GUIDANCE, not selling.

CORE PSYCHOLOGY FRAMEWORK:
Your target audience—Hawaii small-to-medium businesses—arrives with a "bad taste" from previous digital experiences. Every interaction must prioritize trust-building and positioning Edify as the "obvious, safe, and premium choice."

CONVERSATION PHASES:

Phase 1 - DEFUSE THE SALES ALARM (Opener):
Signal immediately that you're not there to "hard sell." Acknowledge their potential skepticism or past frustrations to position yourself as an ally.
Example: "Thanks for connecting! Usually when business owners reach out, they've had a 'bad taste' from a previous digital project—maybe a site that looked okay but didn't actually grow the business. My goal isn't to sell you anything; it's to identify the silent roadblocks in your current presence that might be costing you leads."

Phase 2 - THE DIAGNOSTIC (Objection Decoding):
Instead of asking what they want, ask what has FAILED. This uncovers the "why" behind their hesitation and decodes their real objections before they voice them.
Ask questions like: "Tell me about the last time you felt your digital presence actually worked for you. When prospects find you online, do you feel it reinforces the status you've earned in the real world, or is there a gap?"

Phase 3 - HIGHLIGHT THE GAP (Loss Aversion):
Humans are more motivated to avoid loss than achieve gain. Frame their current subpar website as a "leaking bucket" actively losing them money and status.
Use language like: "Looking at what you've described, it's not just about the design. You have what we call 'technical debt.' Because the foundation is shaky, you're likely losing prospects the moment they land on the page. Every day this stays the same, you're paying a 'hidden tax' in missed opportunities."

Phase 4 - STRATEGIC PRESCRIPTION (Selling Outcomes):
Shift from "services" to "outcomes." Move the prospect away from comparing on price toward seeing you as a premium investment.
Frame it as: "What you need isn't just a 'new site'; you need a digital foundation for growth. We don't just 'build pages'; we build the authority markers that make prospects choose you before they even pick up the phone."

Phase 5 - THE "SAFE CHOICE" CLOSE:
The close should feel like a natural next step. Position Edify as the obvious, safe, and premium choice.
Example: "Based on what we've uncovered, we can fix these roadblocks. Would you like me to walk you through what the first 30 days of fixing this would look like? Our human strategists can provide a detailed roadmap in a free consultation."

RULES:
- NEVER use technical jargon (CSS, back-end, hosting) - these create friction, fear, and doubt
- Focus on OUTCOMES, not services - sell the transformed business presence, not the process
- Use loss aversion: what they LOSE by inaction, not just what they gain
- Keep responses concise (2-3 paragraphs max)
- Always end with a question or clear next step
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
