import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import fs from "fs";
import path from "path";

function getEnvVar(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith(`${name}=`)) {
          return trimmed.slice(name.length + 1).trim();
        }
      }
    }
  } catch {}
  return undefined;
}

export function getAiProvider() {
  const lovableApiKey = getEnvVar("LOVABLE_API_KEY") || getEnvVar("VITE_LOVABLE_API_KEY");
  const geminiApiKey = getEnvVar("GEMINI_API_KEY") || getEnvVar("VITE_GEMINI_API_KEY");
  const openAiApiKey = getEnvVar("OPENAI_API_KEY") || getEnvVar("VITE_OPENAI_API_KEY");
  const groqApiKey = getEnvVar("GROQ_API_KEY") || getEnvVar("VITE_GROQ_API_KEY");

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
