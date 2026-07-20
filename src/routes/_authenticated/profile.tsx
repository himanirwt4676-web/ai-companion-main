import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/chat/AppShell";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile]);

  const saveProfile = async () => {
    try {
      await update.mutateAsync({ name: name.trim() || null, avatar_url: avatarUrl.trim() || null });
      toast.success("Profile updated");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const changePassword = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPw(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setPassword("");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
          <Link to="/chat">
            <ArrowLeft className="h-4 w-4" /> Back to chat
          </Link>
        </Button>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Your information</CardTitle>
            <CardDescription>How you appear across the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Display name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={saveProfile} disabled={update.isPending}>
                {update.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>At least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>New password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={changePassword} disabled={savingPw || !password}>
                {savingPw ? "Updating…" : "Update password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
