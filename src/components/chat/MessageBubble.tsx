import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  role: "user" | "assistant" | "system";
  content: string;
  streaming?: boolean;
}

export function MessageBubble({ role, content, streaming }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            {isUser ? "You" : "Assistant"}
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
          {!isUser && content && !streaming && (
            <div className="mt-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="sm" onClick={copy} className="h-7 gap-1.5 text-xs">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
