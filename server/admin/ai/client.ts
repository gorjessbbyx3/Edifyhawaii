import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn("ANTHROPIC_API_KEY not set. AI agents will not function.");
}

export const anthropic = new Anthropic({
  apiKey: apiKey || "not-configured",
});

export function isAIConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

export interface AgentResponse {
  content: string;
  reasoning?: string;
}

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  options?: { model?: string; maxTokens?: number }
): Promise<string> {
  const response = await anthropic.messages.create({
    model: options?.model || "claude-haiku-4-5",
    max_tokens: options?.maxTokens || 8192,
    system: systemPrompt,
    messages: [
      { role: "user", content: userMessage },
    ],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

export async function chatCompletionJSON<T>(
  systemPrompt: string,
  userMessage: string,
  options?: { model?: string; maxTokens?: number }
): Promise<T> {
  const response = await anthropic.messages.create({
    model: options?.model || "claude-haiku-4-5",
    max_tokens: options?.maxTokens || 8192,
    system: systemPrompt + "\n\nYou must respond with valid JSON only. No other text.",
    messages: [
      { role: "user", content: userMessage },
    ],
  });
  const block = response.content[0];
  const content = block.type === "text" ? block.text : "{}";
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as T;
}
