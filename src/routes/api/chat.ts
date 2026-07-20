import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { streamText } from "ai";
import type { Database } from "@/integrations/supabase/types";
import { getAiProvider } from "@/lib/ai-gateway.server";

type Body = {
  chatId: string;
  content: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

const DEFAULT_MODEL = "gemini-1.5-flash";
const SYSTEM_PROMPT =
  "You are Smart Chatbot AI, a helpful, concise, and friendly assistant. Format answers with Markdown. Use fenced code blocks with language hints for code.";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
        if (!body?.chatId || !body?.content?.trim()) {
          return new Response("Bad request - chatId and content required", { status: 400 });
        }

        // Verify chat ownership
        const { data: chat } = await supabase
          .from("chats")
          .select("id, title")
          .eq("id", body.chatId)
          .maybeSingle();

        if (!chat) return new Response("Chat not found", { status: 404 });

        // Insert user message
        await supabase.from("messages").insert({
          chat_id: body.chatId,
          user_id: userId,
          role: "user",
          content: body.content,
        });

        // If chat title still default, set from first user message
        if (chat.title === "New chat") {
          const title = body.content.trim().slice(0, 60);
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

        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        if (geminiApiKey) {
          if (modelName.startsWith("google/")) {
            modelName = modelName.replace("google/", "");
          }
          if (modelName.includes("gemini-3") || modelName.includes("gemini-2.5") || modelName === "gemini-3-flash-preview") {
            modelName = "gemini-1.5-flash";
          }
        }

        const model = provider(modelName);

        const messages = (history ?? [])
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
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
              controller.enqueue(encoder.encode(`\n\n[Error: ${message}]`));
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
