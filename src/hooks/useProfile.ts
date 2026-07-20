import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ChatSettings = {
  theme: "light" | "dark";
  model: string;
  temperature: number;
  max_tokens: number;
};

export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  settings: ChatSettings;
};

const DEFAULT_SETTINGS: ChatSettings = {
  theme: "dark",
  model: "google/gemini-3-flash-preview",
  temperature: 0.7,
  max_tokens: 2048,
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, settings")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        settings: { ...DEFAULT_SETTINGS, ...((data.settings as Partial<ChatSettings>) ?? {}) },
      };
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Pick<Profile, "name" | "avatar_url" | "settings">>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").update(patch).eq("id", userData.user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
