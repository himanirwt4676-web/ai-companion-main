import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/chat/AppShell";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const Route = createFileRoute("/_authenticated/chat/$chatId")({
  component: ChatView,
});

function ChatView() {
  const { chatId } = Route.useParams();
  return (
    <AppShell>
      <ChatWindow chatId={chatId} />
    </AppShell>
  );
}
