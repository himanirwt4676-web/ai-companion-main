import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChats, useCreateChat } from "@/hooks/useChats";
import { AppShell } from "@/components/chat/AppShell";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const { data: chats, isLoading, isError } = useChats();
  const createChat = useCreateChat();
  const navigate = useNavigate();
  const creatingRef = useRef(false);

  const handleCreateNew = async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    try {
      const chat = await createChat.mutateAsync();
      navigate({ to: "/chat/$chatId", params: { chatId: chat.id }, replace: true });
    } catch (e) {
      creatingRef.current = false;
    }
  };

  useEffect(() => {
    if (chats && chats.length > 0) {
      navigate({ to: "/chat/$chatId", params: { chatId: chats[0].id }, replace: true });
      return;
    }

    if (!isLoading || isError) {
      handleCreateNew();
      return;
    }

    // Safety timeout: auto-create if loading takes > 1.2s
    const timer = setTimeout(() => {
      if (!chats || chats.length === 0) {
        handleCreateNew();
      }
    }, 1200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError, chats?.length]);

  return (
    <AppShell>
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-4">Starting your chat session…</p>
        <Button onClick={handleCreateNew} disabled={createChat.isPending} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Start New Chat Now
        </Button>
      </div>
    </AppShell>
  );
}
