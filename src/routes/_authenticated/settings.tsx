import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/chat/AppShell";
import { useProfile, useUpdateProfile, type ChatSettings } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const MODELS = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (fast, default)" },
  { id: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { id: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (deep reasoning)" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
];

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const [settings, setSettings] = useState<ChatSettings | null>(null);

  useEffect(() => {
    if (profile) setSettings(profile.settings);
  }, [profile]);

  useEffect(() => {
    if (settings?.theme === "dark") document.documentElement.classList.add("dark");
    else if (settings?.theme === "light") document.documentElement.classList.remove("dark");
  }, [settings?.theme]);

  if (!settings) return null;

  const save = async () => {
    try {
      await update.mutateAsync({ settings });
      toast.success("Settings saved");
    } catch (e) {
      toast.error((e as Error).message);
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
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how the interface looks.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label htmlFor="theme">Dark mode</Label>
            <Switch
              id="theme"
              checked={settings.theme === "dark"}
              onCheckedChange={(v) => setSettings({ ...settings, theme: v ? "dark" : "light" })}
            />
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Model</CardTitle>
            <CardDescription>Pick the AI model powering your chats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>AI model</Label>
              <Select value={settings.model} onValueChange={(model) => setSettings({ ...settings, model })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Temperature</Label>
                <span className="text-sm text-muted-foreground">{settings.temperature.toFixed(2)}</span>
              </div>
              <Slider
                value={[settings.temperature]}
                min={0}
                max={2}
                step={0.05}
                onValueChange={([v]) => setSettings({ ...settings, temperature: v })}
              />
              <p className="text-xs text-muted-foreground">
                Lower = more focused. Higher = more creative.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Max tokens</Label>
                <span className="text-sm text-muted-foreground">{settings.max_tokens}</span>
              </div>
              <Slider
                value={[settings.max_tokens]}
                min={256}
                max={8192}
                step={128}
                onValueChange={([v]) => setSettings({ ...settings, max_tokens: v })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
