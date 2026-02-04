import OpenAI from "openai";

const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

if (!apiKey || !baseURL) {
  console.warn("AI Integrations environment variables not set. AI agents will not function.");
}

export const openai = new OpenAI({
  apiKey: apiKey || "not-configured",
  baseURL: baseURL || "https://api.openai.com/v1",
});

export function isAIConfigured(): boolean {
  return !!(process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);
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
  const response = await openai.chat.completions.create({
    model: options?.model || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: options?.maxTokens || 1024,
  });
  return response.choices[0]?.message?.content || "";
}

export async function chatCompletionJSON<T>(
  systemPrompt: string,
  userMessage: string,
  options?: { model?: string; maxTokens?: number }
): Promise<T> {
  const response = await openai.chat.completions.create({
    model: options?.model || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: options?.maxTokens || 1024,
    response_format: { type: "json_object" },
  });
  const content = response.choices[0]?.message?.content || "{}";
  return JSON.parse(content) as T;
}
