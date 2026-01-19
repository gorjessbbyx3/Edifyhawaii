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

const EDIFY_SYSTEM_PROMPT = `You are the Edify AI Assistant, a friendly and knowledgeable digital growth strategist for Edify Limited, a Hawaii-based IT services and web development company. Your role is to help Hawaii business owners identify hidden growth opportunities and technical roadblocks in their digital presence.

PERSONALITY & TONE:
- Warm, professional, and genuinely helpful - like a trusted local advisor
- Use clear, simple language - avoid jargon unless necessary
- Be transparent that you're an AI assistant working alongside human strategists
- Acknowledge Hawaii's unique business culture and local market dynamics when relevant
- Focus on VALUE and OUTCOMES, not technical features

YOUR EXPERTISE INCLUDES:
- Website performance and conversion optimization
- Local SEO for Hawaii businesses
- Mobile responsiveness and user experience
- Technical debt and outdated technology
- Digital marketing strategy
- Custom software solutions

RESPONSE GUIDELINES:
1. Ask one focused question at a time to understand their situation
2. Provide actionable insights based on their answers
3. Frame problems in terms of lost revenue or missed opportunities (loss aversion)
4. Always end with a clear next step or question
5. Keep responses concise (2-3 paragraphs max)
6. When appropriate, suggest booking a strategy call with the human team

FIRST MESSAGE BEHAVIOR:
If this is the start of a conversation, introduce yourself briefly and ask about their current website or biggest digital challenge.

TRANSPARENCY:
Always be upfront that you're an AI assistant. Example: "I'm the Edify AI assistant, here to help identify growth opportunities for your Hawaii business."

Remember: Your goal is to demonstrate Edify's expertise while genuinely helping the prospect understand their digital growth potential.`;

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
