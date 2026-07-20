import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUp, Square, RefreshCw, Sparkles, Paperclip, X, Image as ImageIcon, FileText } from "lucide-react";
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

export type Attachment = {
  id: string;
  name: string;
  type: "image" | "file";
  mimeType: string;
  data: string;
  previewUrl?: string;
};

export function ChatWindow({ chatId }: Props) {
  const { data: profile } = useProfile();
  const { data: messages = [] } = useMessages(chatId);
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [assistantDraft, setAssistantDraft] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, assistantDraft]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 15MB)`);
        continue;
      }

      const isImage = file.type.startsWith("image/");
      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type.includes("pdf");
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          type: isImage ? "image" : "file",
          mimeType: file.type || "application/octet-stream",
          data: result,
          previewUrl: isImage ? result : undefined,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };

      if (isImage || isPdf) {
        // Read images and PDFs as Data URLs (base64) so binary data is not corrupted as raw text
        reader.readAsDataURL(file);
      } else {
        // Read text/code files as text
        reader.readAsText(file);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const send = async (content: string) => {
    if ((!content.trim() && attachments.length === 0) || streaming) return;
    const currentAttachments = [...attachments];
    setInput("");
    setAttachments([]);
    setStreaming(true);
    setAssistantDraft("");

    // Build user message preview text cleanly (no raw binary streams!)
    let fullContent = content.trim();
    if (currentAttachments.length > 0) {
      const fileSummaries = currentAttachments
        .map((a) => {
          if (a.type === "image") return `![${a.name}]`;
          if (a.name.toLowerCase().endsWith(".pdf") || a.mimeType.includes("pdf")) {
            return `📎 [Attached PDF Document: ${a.name}]`;
          }
          return `\n\n--- Attachment: ${a.name} ---\n${a.data.slice(0, 3000)}\n--- End Attachment ---`;
        })
        .join("\n");
      fullContent = fullContent ? `${fullContent}\n${fileSummaries}` : fileSummaries;
    }

    // Optimistic user message
    qc.setQueryData(["messages", chatId], (old: any) => [
      ...(old ?? []),
      {
        id: `optimistic-${Date.now()}`,
        chat_id: chatId,
        role: "user",
        content: fullContent,
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
          content: fullContent,
          model: profile?.settings.model,
          temperature: profile?.settings.temperature,
          maxTokens: profile?.settings.max_tokens,
          language: profile?.settings.language,
          country: profile?.settings.country,
          attachments: currentAttachments.map((a) => ({
            name: a.name,
            type: a.type,
            mimeType: a.mimeType,
            data: a.data,
          })),
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
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (lastAssistant && lastAssistant.created_at > lastUser.created_at) {
      await supabase.from("messages").delete().eq("id", lastAssistant.id);
    }
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
              Ask questions, upload images or PDFs for analysis, attach code or documents, brainstorm, and more.
            </p>
          </div>
        ) : (
          <div className="pb-32">
            {messages.map((m) => (
              <MessageBubble key={m.id} id={m.id} chatId={chatId} role={m.role} content={m.content} />
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

          {/* Attachment Previews */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-card rounded-xl border border-border">
              {attachments.map((att) => (
                <div key={att.id} className="relative group flex items-center gap-2 rounded-lg border bg-background p-1.5 pr-6 text-xs shadow-sm">
                  {att.type === "image" && att.previewUrl ? (
                    <img src={att.previewUrl} alt={att.name} className="h-10 w-10 object-cover rounded-md" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <FileText className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 max-w-[120px]">
                    <p className="truncate font-medium">{att.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      {att.name.toLowerCase().endsWith(".pdf") ? "PDF Document" : att.type}
                    </p>
                  </div>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="absolute right-1 top-1 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.txt,.md,.json,.csv,.js,.ts,.tsx,.py"
              className="hidden"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
              title="Attach image or PDF file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message Smart Chatbot AI… (Attach PDFs or images)"
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
                disabled={!input.trim() && attachments.length === 0}
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
