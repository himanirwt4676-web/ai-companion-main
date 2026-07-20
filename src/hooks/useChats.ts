import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Chat = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
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
        .select("id, title, created_at, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
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
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chats"] }),
  });
}

export function useDeleteChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chats"] }),
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
