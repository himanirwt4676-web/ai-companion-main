import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUp, Square, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMessages } from "@/hooks/useChats";
import { useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageBubble } from "./MessageBubble";

interface Props {
  chatId: string;
}

export function ChatWindow({ chatId }: Props) {
  const { data: profile } = useProfile();
  const { data: messages = [] } = useMessages(chatId);
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [assistantDraft, setAssistantDraft] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, assistantDraft]);

  const send = async (content: string) => {
    if (!content.trim() || streaming) return;
    setInput("");
    setStreaming(true);
    setAssistantDraft("");

    // Optimistic user message
    qc.setQueryData(["messages", chatId], (old: any) => [
      ...(old ?? []),
      {
        id: `optimistic-${Date.now()}`,
        chat_id: chatId,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      },
    ]);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Not signed in");

      const res = await fetch("/api/chat", {
        method: "POST",
        signal: ac.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId,
          content,
          model: profile?.settings.model,
          temperature: profile?.settings.temperature,
          maxTokens: profile?.settings.max_tokens,
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setAssistantDraft(acc);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error((err as Error).message || "Something went wrong");
      }
    } finally {
      setStreaming(false);
      setAssistantDraft("");
      abortRef.current = null;
      qc.invalidateQueries({ queryKey: ["messages", chatId] });
      qc.invalidateQueries({ queryKey: ["chats"] });
    }
  };

  const stop = () => abortRef.current?.abort();

  const regenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    // Delete last assistant if present
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (lastAssistant && lastAssistant.created_at > lastUser.created_at) {
      await supabase.from("messages").delete().eq("id", lastAssistant.id);
    }
    // Also delete the user message so send() re-inserts it
    await supabase.from("messages").delete().eq("id", lastUser.id);
    await qc.invalidateQueries({ queryKey: ["messages", chatId] });
    send(lastUser.content);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const empty = messages.length === 0 && !streaming;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">How can I help you today?</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ask anything. I can explain concepts, write code, brainstorm, summarize, and more.
            </p>
          </div>
        ) : (
          <div className="pb-32">
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} />
            ))}
            {streaming && <MessageBubble role="assistant" content={assistantDraft} streaming />}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          {!streaming && messages.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={regenerate} className="h-8 gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </Button>
            </div>
          )}
          <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message Smart Chatbot AI…"
              rows={1}
              className="max-h-52 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
            />
            {streaming ? (
              <Button size="icon" variant="destructive" onClick={stop} className="h-9 w-9 shrink-0 rounded-xl">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="h-9 w-9 shrink-0 rounded-xl"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
