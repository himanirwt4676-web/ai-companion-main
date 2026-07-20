import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChats, useCreateChat } from "@/hooks/useChats";
import { AppShell } from "@/components/chat/AppShell";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatIndex,
});

function ChatIndex() {
  const { data: chats, isLoading } = useChats();
  const createChat = useCreateChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (chats && chats.length > 0) {
      navigate({ to: "/chat/$chatId", params: { chatId: chats[0].id }, replace: true });
    } else if (!createChat.isPending) {
      createChat.mutateAsync().then((chat) => {
        navigate({ to: "/chat/$chatId", params: { chatId: chat.id }, replace: true });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, chats?.length]);

  return (
    <AppShell>
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    </AppShell>
  );
}
