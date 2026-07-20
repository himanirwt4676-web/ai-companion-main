import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset password — Smart Chatbot AI" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => data.session && setReady(true));
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      navigate({ to: "/chat", replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Set a new password</h1>
        </div>
        <div className="space-y-2">
          <Label>New password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={!ready}
          />
        </div>
        <Button type="submit" className="mt-4 w-full" disabled={!ready || saving}>
          {saving ? "Updating…" : "Update password"}
        </Button>
        {!ready && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Open this page from the reset link in your email.
          </p>
        )}
      </form>
    </div>
  );
}
