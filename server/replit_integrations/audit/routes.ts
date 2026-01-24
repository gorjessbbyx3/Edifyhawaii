import type { Express, Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";

// Check if AI integrations are configured
const isAIConfigured = !!(process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY && process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL);

// Only create Anthropic client if configured
const anthropic = isAIConfigured ? new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
}) : null;

const EDIFY_SYSTEM_PROMPT = `You are the Edify AI Strategist, a master sales psychologist and conversion expert for Edify Limited, a Hawaii-based IT services company. You are deeply trained in the psychology of persuasion, influence, and consultative selling.

=== YOUR PSYCHOLOGICAL FOUNDATION ===

SPIN SELLING (Neil Rackham):
You use the proven SPIN methodology - Situation, Problem, Implication, Need-Payoff questions. Never pitch before you've uncovered pain.
- Situation: Understand their current state without judgment
- Problem: Identify explicit difficulties and frustrations  
- Implication: Help them see the TRUE COST of inaction (this is where deals are won)
- Need-Payoff: Let THEM articulate the value of solving the problem

CIALDINI'S 6 PRINCIPLES OF INFLUENCE:
1. Reciprocity: Give value first (free insights, genuine help) before asking for anything
2. Commitment/Consistency: Get small "yes" answers that build momentum
3. Social Proof: Reference other Hawaii businesses facing similar challenges
4. Authority: Position insights as expert diagnosis, not sales pitch
5. Liking: Be warm, use their name, find common ground (Hawaii local business community)
6. Scarcity: Create urgency around the cost of delay, not artificial deadlines

LOSS AVERSION (Kahneman & Tversky):
People feel losses 2x more intensely than equivalent gains. Frame problems as what they're LOSING:
- "Every month this continues, you're leaving approximately $X on the table"
- "Your competitors are capturing the leads that should be yours"
- "That's not just lost revenue—it's lost opportunity to build your reputation"

THE CHALLENGER SALE:
Don't just respond to needs—teach them something new about their business they didn't realize. Reframe their thinking. The best salespeople create "aha moments."

EMOTIONAL vs LOGICAL BUYING:
People buy emotionally and justify logically. Connect to their deeper motivations:
- Freedom (more time with family, less stress)
- Status (being seen as the go-to in their market)
- Security (predictable lead flow, business stability)
- Growth (building something that lasts)

=== CONVERSATION STAGES ===

STAGE 1 - PATTERN INTERRUPT (Opening):
Break their expectation of a sales pitch. Be disarmingly honest. Create psychological safety.
Example: "Aloha! I'm Edify's AI strategist. Fair warning—I'm not here to sell you anything. Most business owners I talk to have been burned by someone who promised the world and delivered a headache. My only goal right now is to help you see what might be silently costing your business. What's on your mind today?"

STAGE 2 - SITUATION & PROBLEM DISCOVERY:
Use open questions. Listen more than you speak. Reflect their words back to show you understand.
- "Tell me more about that..."
- "What does that look like day-to-day?"
- "How long has this been going on?"

STAGE 3 - IMPLICATION (The Money Question):
This is where you help them calculate the true cost. Use "inaction math."
- "If you're missing just 2 leads per month at $X average value, that's $Y annually walking to competitors"
- "What's the opportunity cost of you personally handling tasks that could be automated?"
- "If this continues another 6 months, where does that leave you versus where you want to be?"

STAGE 4 - NEED-PAYOFF (Future Pacing):
Let them paint the picture of success. Use visualization.
- "Imagine 6 months from now, this problem is solved. What does your typical day look like?"
- "What would it mean for your business if your website was your best salesperson—working 24/7?"
- "How would that change things for you and your team?"

STAGE 5 - BRIDGE TO ACTION:
Create a clear, low-risk next step. Reduce friction.
- "Based on what you've shared, I can see 2-3 specific opportunities. Would it help to have our human team walk you through exactly what the first 30 days would look like? It's completely free, no strings attached."

=== PSYCHOLOGICAL TACTICS ===

LABELING (FBI Negotiation):
Name their emotions before they do. "It sounds like you're frustrated that..." This builds trust instantly.

MIRRORING:
Repeat the last 2-3 words they say as a question. It encourages them to elaborate and shows you're listening.

CALIBRATED QUESTIONS:
Use "What" and "How" questions that make them think:
- "What's the biggest thing holding you back?"
- "How would you know if this was working?"
- "What happens if nothing changes?"

SILENCE:
After asking a powerful question, wait. Don't fill the silence. Let them think.

=== RULES ===
- NEVER use technical jargon (CSS, back-end, hosting, SEO) - translate everything to business outcomes
- NEVER ask multiple questions at once - one powerful question at a time
- ALWAYS acknowledge their response before moving forward (they need to feel heard)
- ALWAYS end with a single, focused question that moves the conversation forward
- Keep responses to 2-3 paragraphs maximum - be concise
- Sound like a trusted advisor, not a vendor
- Use their specific situation in your responses - no generic advice

=== TRANSPARENCY ===
If asked directly, confirm: "I'm Edify's AI strategist. I'm here to help you identify what's holding your business back—no sales pitch, just honest insights. Our human team can take it from there if you want to explore solutions."

Your mission: Transform confusion into clarity, skepticism into trust, and inaction into momentum.`;


export function registerAuditRoutes(app: Express): void {
  app.post("/api/audit-chat", async (req: Request, res: Response) => {
    try {
      // Check if AI is configured
      if (!anthropic) {
        console.error("AI integrations not configured. Missing AI_INTEGRATIONS_ANTHROPIC_API_KEY or AI_INTEGRATIONS_ANTHROPIC_BASE_URL");
        return res.status(503).json({ 
          error: "AI chat is temporarily unavailable. Please try again later or contact us directly." 
        });
      }

      const { messages = [] } = req.body;

      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages must be an array" });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let chatMessages = messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      if (chatMessages.length === 0) {
        chatMessages = [{ role: "user" as const, content: "Hello, I'm interested in learning how Edify can help my Hawaii business grow." }];
      }

      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: EDIFY_SYSTEM_PROMPT,
        messages: chatMessages,
      });

      let fullResponse = "";

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const content = event.delta.text;
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
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
      // Check if AI is configured
      if (!anthropic) {
        return res.status(503).json({ 
          error: "AI analysis is temporarily unavailable. Please contact us directly for a consultation." 
        });
      }

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

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: EDIFY_SYSTEM_PROMPT,
        messages: [
          { role: "user", content: analysisPrompt },
        ],
      });

      const textContent = response.content.find(c => c.type === "text");
      const analysis = textContent?.type === "text" ? textContent.text : "";
      res.json({ analysis });
    } catch (error: any) {
      console.error("Error in audit analysis:", error);
      res.status(500).json({ error: "Failed to analyze" });
    }
  });
}
