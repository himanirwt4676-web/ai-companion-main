import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { streamText } from "ai";
import type { Database } from "@/integrations/supabase/types";
import { getAiProvider } from "@/lib/ai-gateway.server";
import fs from "fs";
import path from "path";

type AttachmentInput = {
  name: string;
  type: "image" | "file";
  mimeType: string;
  data: string;
};

type Body = {
  chatId: string;
  content: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  language?: string;
  country?: string;
  attachments?: AttachmentInput[];
};

const DEFAULT_MODEL = "gemini-2.5-flash";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish (Español)",
  hi: "Hindi (हिन्दी)",
  fr: "French (Français)",
  de: "German (Deutsch)",
  ja: "Japanese (日本語)",
  zh: "Chinese (中文)",
  pt: "Portuguese (Português)",
  ar: "Arabic (العربية)",
  ru: "Russian (Русский)",
  it: "Italian (Italiano)",
  ko: "Korean (한국어)",
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  IN: "India",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  CN: "China",
  BR: "Brazil",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  MX: "Mexico",
  IT: "Italy",
  ES: "Spain",
  SG: "Singapore",
  ZA: "South Africa",
  KR: "South Korea",
};

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

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = getEnvVar("SUPABASE_URL") || getEnvVar("VITE_SUPABASE_URL");
        const supabaseKey = getEnvVar("SUPABASE_PUBLISHABLE_KEY") || getEnvVar("VITE_SUPABASE_PUBLISHABLE_KEY");

        if (!supabaseUrl || !supabaseKey) {
          return new Response("Supabase not configured in .env file (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing)", {
            status: 500,
          });
        }

        const provider = getAiProvider();
        if (!provider) {
          return new Response(
            "AI API Key missing! Please add GEMINI_API_KEY, LOVABLE_API_KEY, or OPENAI_API_KEY to your .env file.",
            { status: 500 }
          );
        }

        const auth = request.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (!token) return new Response("Unauthorized - Please sign in", { status: 401 });

        const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData.user) return new Response("Unauthorized user", { status: 401 });
        const userId = userData.user.id;

        const body = (await request.json()) as Body;
        if (!body?.chatId || (!body?.content?.trim() && (!body?.attachments || body.attachments.length === 0))) {
          return new Response("Bad request - chatId and content or attachments required", { status: 400 });
        }

        // Verify chat ownership
        const { data: chat } = await supabase
          .from("chats")
          .select("id, title")
          .eq("id", body.chatId)
          .maybeSingle();

        if (!chat) return new Response("Chat not found", { status: 404 });

        // Process PDF attachments dynamically with pdf-parse
        let extractedPdfText = "";
        for (const att of body.attachments || []) {
          if (att.name.toLowerCase().endsWith(".pdf") || att.mimeType.includes("pdf")) {
            try {
              const pdfParse = require("pdf-parse");
              const base64Str = att.data.includes(";base64,") ? att.data.split(";base64,")[1] : att.data;
              const buffer = Buffer.from(base64Str, "base64");
              const parsed = await pdfParse(buffer);
              if (parsed?.text && parsed.text.trim()) {
                extractedPdfText += `\n\n--- Document Attachment (${att.name}) ---\n${parsed.text.trim()}\n--- End Document Attachment ---`;
              }
            } catch (pdfErr) {
              console.error("[PDF Parse Error]:", pdfErr);
            }
          }
        }

        // Combine prompt text
        const combinedUserText = (body.content + extractedPdfText).trim();

        // Insert user message
        await supabase.from("messages").insert({
          chat_id: body.chatId,
          user_id: userId,
          role: "user",
          content: combinedUserText,
        });

        // If chat title still default, set from first user message
        if (chat.title === "New chat") {
          const title = (body.content || "Attached document").trim().slice(0, 60);
          await supabase.from("chats").update({ title }).eq("id", body.chatId);
        } else {
          await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", body.chatId);
        }

        // Load full history
        const { data: history } = await supabase
          .from("messages")
          .select("role, content")
          .eq("chat_id", body.chatId)
          .order("created_at", { ascending: true });

        let modelName = body.model || DEFAULT_MODEL;

        const geminiApiKey = getEnvVar("GEMINI_API_KEY") || getEnvVar("VITE_GEMINI_API_KEY");
        if (geminiApiKey) {
          modelName = "gemini-2.5-flash";
        }

        const model = provider(modelName);

        // Build history messages
        const historyMessages = (history ?? [])
          .slice(0, -1)
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

        // Format the latest user message with multimodal content parts for Gemini Vision / files
        const imageAttachments = (body.attachments || []).filter((a) => a.type === "image" && a.data);

        let latestUserContent: any = combinedUserText;
        if (imageAttachments.length > 0) {
          latestUserContent = [
            { type: "text", text: combinedUserText || "Please analyze the attached image(s)." },
            ...imageAttachments.map((img) => ({
              type: "image",
              image: img.data,
            })),
          ];
        }

        const messages = [
          ...historyMessages,
          {
            role: "user" as const,
            content: latestUserContent,
          },
        ];

        // Dynamic Real-time Date/Time & Multilingual Prompt Context
        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });

        const userLangCode = body.language || "en";
        const userLangName = LANGUAGE_NAMES[userLangCode] || "English";
        const userCountryCode = body.country || "US";
        const userCountryName = COUNTRY_NAMES[userCountryCode] || userCountryCode;

        const systemPrompt = `You are Smart Chatbot AI, a helpful, highly intelligent, and friendly AI companion with multimodal image and PDF document analysis capabilities.

REAL-TIME CONTEXT DATA:
- Current Date: ${formattedDate} (${now.toISOString().split("T")[0]})
- Current Time: ${formattedTime}
- System Timestamp: ${now.toISOString()}
- User Location / Country Context: ${userCountryName} (${userCountryCode})
- Preferred Language: ${userLangName} (${userLangCode})

MANDATORY INSTRUCTIONS:
1. DOCUMENT & PDF ANALYSIS: You have full access to extracted PDF texts, documents, screenshots, and images attached by the user. Thoroughly read and analyze any attached PDFs or documents, summarize them, or answer any questions about them accurately.
2. REAL-TIME ACCURACY: You have direct awareness of the exact current date, time, and timezone listed above. Whenever the user asks for the time, date, day of the week, or time-sensitive location details, give exact and accurate answers using this real-time context.
3. MULTILINGUAL RESPONSES: All your answers MUST be written in ${userLangName} unless the user explicitly requests another language.
4. FORMATTING: Use clean, beautiful Markdown formatting and fenced code blocks with syntax highlighting for code snippets.`;

        const result = streamText({
          model,
          system: systemPrompt,
          messages,
          temperature: body.temperature ?? 0.7,
          maxOutputTokens: body.maxTokens ?? 2048,
        });

        // Tee stream: send to client + accumulate to persist assistant message
        let assistantText = "";
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const delta of result.textStream) {
                assistantText += delta;
                controller.enqueue(encoder.encode(delta));
              }
              controller.close();
            } catch (err) {
              const message = err instanceof Error ? err.message : "Model error";
              console.error("[Chat API Error]:", message);
              assistantText = `[Error generating response: ${message}]`;
              controller.enqueue(encoder.encode(assistantText));
              controller.close();
            } finally {
              if (assistantText.trim()) {
                await supabase.from("messages").insert({
                  chat_id: body.chatId,
                  user_id: userId,
                  role: "assistant",
                  content: assistantText,
                });
              }
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
