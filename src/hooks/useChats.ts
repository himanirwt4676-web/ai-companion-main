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

const LOCAL_RECYCLE_BIN_KEY = "ai_companion_recycle_bin_v1";

type LocalDeletedItem = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

function getLocalRecycleBin(): LocalDeletedItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_RECYCLE_BIN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRecycleBin(items: LocalDeletedItem[]) {
  try {
    localStorage.setItem(LOCAL_RECYCLE_BIN_KEY, JSON.stringify(items));
  } catch {}
}

function getLocalDeletedIds(): string[] {
  return getLocalRecycleBin().map((i) => i.id);
}

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    staleTime: 1000 * 5,
    queryFn: async (): Promise<Chat[]> => {
      const localDeleted = getLocalDeletedIds();

      try {
        const { data, error } = await supabase
          .from("chats")
          .select("id, title, created_at, updated_at, deleted_at")
          .is("deleted_at", null)
          .order("updated_at", { ascending: false });

        if (!error && data) {
          return (data as Chat[]).filter((c) => !localDeleted.includes(c.id));
        }
      } catch (e) {
        console.warn("[useChats fallback]: deleted_at query failed, attempting standard query", e);
      }

      // Fallback: Query chats without deleted_at requirement
      const { data, error } = await supabase
        .from("chats")
        .select("id, title, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return ((data ?? []) as Chat[]).filter((c) => !localDeleted.includes(c.id));
    },
  });
}

export function useRecycleBin() {
  return useQuery({
    queryKey: ["recycle-bin"],
    queryFn: async (): Promise<DeletedChat[]> => {
      const now = Date.now();
      const localItems = getLocalRecycleBin();
      let remoteItems: Chat[] = [];

      try {
        const { data, error } = await supabase
          .from("chats")
          .select("id, title, created_at, updated_at, deleted_at")
          .not("deleted_at", "is", null)
          .order("deleted_at", { ascending: false });

        if (!error && data) {
          remoteItems = data as Chat[];
        }
      } catch (e) {
        console.warn("[useRecycleBin fallback]: remote query skipped", e);
      }

      // Merge remote and local items
      const mergedMap = new Map<string, Chat>();
      for (const item of remoteItems) {
        if (item.deleted_at) mergedMap.set(item.id, item);
      }
      for (const item of localItems) {
        if (!mergedMap.has(item.id)) mergedMap.set(item.id, item);
      }

      const activeDeleted: DeletedChat[] = [];
      const expiredIds: string[] = [];

      for (const item of mergedMap.values()) {
        if (item.deleted_at) {
          const deletedTime = new Date(item.deleted_at).getTime();
          const daysPassed = Math.floor((now - deletedTime) / (1000 * 60 * 60 * 24));
          const daysLeft = Math.max(0, 30 - daysPassed);

          if (daysPassed >= 30) {
            expiredIds.push(item.id);
          } else {
            activeDeleted.push({ ...item, daysLeft });
          }
        }
      }

      // Clean up expired items
      if (expiredIds.length > 0) {
        const remainingLocal = localItems.filter((i) => !expiredIds.includes(i.id));
        saveLocalRecycleBin(remainingLocal);
        supabase.from("chats").delete().in("id", expiredIds).then(() => {});
      }

      return activeDeleted;
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

// Soft delete chat (moves to 30-day Recycle Bin with hybrid local + database persistence)
export function useSoftDeleteChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // 1. Fetch chat details to store in local Recycle Bin fallback
      const { data: chat } = await supabase
        .from("chats")
        .select("id, title, created_at, updated_at")
        .eq("id", id)
        .maybeSingle();

      const deletedAt = new Date().toISOString();

      if (chat) {
        const local = getLocalRecycleBin();
        const updatedLocal = [
          { ...chat, deleted_at: deletedAt },
          ...local.filter((i) => i.id !== id),
        ];
        saveLocalRecycleBin(updatedLocal);
      }

      // 2. Try updating deleted_at in Supabase DB
      try {
        await supabase
          .from("chats")
          .update({ deleted_at: deletedAt })
          .eq("id", id);
      } catch (e) {
        console.warn("[softDeleteChat] DB update skipped", e);
      }
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
      // 1. Remove from local Recycle Bin
      const local = getLocalRecycleBin();
      saveLocalRecycleBin(local.filter((i) => i.id !== id));

      // 2. Clear deleted_at in Supabase DB
      try {
        await supabase
          .from("chats")
          .update({ deleted_at: null })
          .eq("id", id);
      } catch (e) {
        console.warn("[restoreChat] DB update skipped", e);
      }
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
      // 1. Remove from local Recycle Bin
      const local = getLocalRecycleBin();
      saveLocalRecycleBin(local.filter((i) => i.id !== id));

      // 2. Permanently delete from Supabase DB
      const { error } = await supabase.from("chats").delete().eq("id", id);
      if (error) console.warn("[permanentDeleteChat] error", error);
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
