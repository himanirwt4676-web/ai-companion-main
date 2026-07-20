import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function getAiProvider() {
  const lovableApiKey = process.env.LOVABLE_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (lovableApiKey) {
    return createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": lovableApiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });
  }

  if (geminiApiKey) {
    return createOpenAICompatible({
      name: "gemini",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: geminiApiKey,
    });
  }

  if (openAiApiKey) {
    return createOpenAICompatible({
      name: "openai",
      baseURL: "https://api.openai.com/v1",
      apiKey: openAiApiKey,
    });
  }

  if (groqApiKey) {
    return createOpenAICompatible({
      name: "groq",
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqApiKey,
    });
  }

  return null;
}
