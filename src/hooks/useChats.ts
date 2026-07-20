import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Chat = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type DeletedChat = Chat & {
  daysLeft: number;
};

export type Message = {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<Chat[]> => {
      const { data, error } = await supabase
        .from("chats")
        .select("id, title, created_at, updated_at, deleted_at")
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Chat[];
    },
  });
}

export function useRecycleBin() {
  return useQuery({
    queryKey: ["recycle-bin"],
    queryFn: async (): Promise<DeletedChat[]> => {
      const { data, error } = await supabase
        .from("chats")
        .select("id, title, created_at, updated_at, deleted_at")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });
      if (error) throw error;

      const now = Date.now();
      const items: DeletedChat[] = [];
      const expiredIds: string[] = [];

      for (const item of (data ?? []) as Chat[]) {
        if (item.deleted_at) {
          const deletedTime = new Date(item.deleted_at).getTime();
          const daysPassed = Math.floor((now - deletedTime) / (1000 * 60 * 60 * 24));
          const daysLeft = Math.max(0, 30 - daysPassed);

          if (daysPassed >= 30) {
            expiredIds.push(item.id);
          } else {
            items.push({ ...item, daysLeft });
          }
        }
      }

      // Auto purge items older than 30 days
      if (expiredIds.length > 0) {
        supabase.from("chats").delete().in("id", expiredIds).then(() => {});
      }

      return items;
    },
  });
}

export function useMessages(chatId: string | undefined) {
  return useQuery({
    queryKey: ["messages", chatId],
    enabled: !!chatId,
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, chat_id, role, content, created_at")
        .eq("chat_id", chatId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });
}

export function useCreateChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<Chat> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("chats")
        .insert({ user_id: userData.user.id, title: "New chat" })
        .select("id, title, created_at, updated_at")
        .single();
      if (error) throw error;
      return data as Chat;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chats"] }),
  });
}

// Soft delete chat (moves to 30-day Recycle Bin)
export function useSoftDeleteChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("chats")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chats"] });
      qc.invalidateQueries({ queryKey: ["recycle-bin"] });
    },
  });
}

// Restore chat from Recycle Bin
export function useRestoreChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("chats")
        .update({ deleted_at: null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chats"] });
      qc.invalidateQueries({ queryKey: ["recycle-bin"] });
    },
  });
}

// Permanently delete chat immediately
export function usePermanentDeleteChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chats"] });
      qc.invalidateQueries({ queryKey: ["recycle-bin"] });
    },
  });
}

// Delete individual message
export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageId, chatId }: { messageId: string; chatId: string }) => {
      const { error } = await supabase.from("messages").delete().eq("id", messageId);
      if (error) throw error;
      return { chatId };
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["messages", vars.chatId] });
    },
  });
}

export function useRenameChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase.from("chats").update({ title }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chats"] }),
  });
}
