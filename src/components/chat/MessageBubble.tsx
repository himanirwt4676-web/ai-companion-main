import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Bot, User, Copy, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDeleteMessage } from "@/hooks/useChats";
import { toast } from "sonner";

interface Props {
  id?: string;
  chatId?: string;
  role: "user" | "assistant" | "system";
  content: string;
  streaming?: boolean;
}

export function MessageBubble({ id, chatId, role, content, streaming }: Props) {
  const [copied, setCopied] = useState(false);
  const deleteMessage = useDeleteMessage();
  const isUser = role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const removeMessage = async () => {
    if (!id || !chatId) return;
    try {
      await deleteMessage.mutateAsync({ messageId: id, chatId });
      toast.success("Message deleted");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className={cn("group flex gap-3 px-4 py-6", isUser ? "bg-transparent" : "bg-muted/30")}>
      <div className="mx-auto flex w-full max-w-3xl gap-4">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {isUser ? "You" : "Assistant"}
            </span>

            {!streaming && id && (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" onClick={copy} className="h-6 w-6 text-muted-foreground hover:text-foreground" title="Copy message">
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={removeMessage} className="h-6 w-6 text-muted-foreground hover:text-destructive" title="Delete message">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background prose-pre:border prose-pre:border-border prose-code:before:content-none prose-code:after:content-none">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : streaming ? (
              <span className="inline-block h-4 w-2 animate-pulse bg-foreground/60" />
            ) : null}
            {streaming && content ? (
              <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-foreground/60 align-middle" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
