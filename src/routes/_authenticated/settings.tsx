import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Globe, MapPin, Check, MessageSquare } from "lucide-react";
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

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español (Spanish)", flag: "🇪🇸" },
  { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "fr", label: "Français (French)", flag: "🇫🇷" },
  { code: "de", label: "Deutsch (German)", flag: "🇩🇪" },
  { code: "ja", label: "日本語 (Japanese)", flag: "🇯🇵" },
  { code: "zh", label: "中文 (Chinese)", flag: "🇨🇳" },
  { code: "pt", label: "Português (Portuguese)", flag: "🇧🇷" },
  { code: "ar", label: "العربية (Arabic)", flag: "🇦🇪" },
  { code: "ru", label: "Русский (Russian)", flag: "🇷🇺" },
  { code: "it", label: "Italiano (Italian)", flag: "🇮🇹" },
  { code: "ko", label: "한국어 (Korean)", flag: "🇰🇷" },
];

export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
];

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
  const navigate = useNavigate();
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

  const saveSettings = async (newSettings: ChatSettings, navigateBack = false) => {
    setSettings(newSettings);
    try {
      await update.mutateAsync({ settings: newSettings });
      toast.success("Settings saved successfully");
      if (navigateBack) {
        navigate({ to: "/chat" });
      }
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-8 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link to="/chat">
              <ArrowLeft className="h-4 w-4" /> Back to chat
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => saveSettings(settings, true)}
            disabled={update.isPending}
            className="gap-2 font-medium"
          >
            <Check className="h-4 w-4" /> Save & Start Chatting
          </Button>
        </div>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Settings</h1>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Language & Region
            </CardTitle>
            <CardDescription>
              Choose your preferred response language and country context for AI answers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium">
                <Globe className="h-4 w-4" /> Response Language (12 Working Languages)
              </Label>
              <Select
                value={settings.language || "en"}
                onValueChange={(language) => {
                  const updated = { ...settings, language };
                  saveSettings(updated);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      <span className="mr-2">{l.flag}</span>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4" /> Country / Region Context
              </Label>
              <Select
                value={settings.country || "US"}
                onValueChange={(country) => {
                  const updated = { ...settings, country };
                  saveSettings(updated);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="mr-2">{c.flag}</span>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how the interface looks.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label htmlFor="theme">Dark mode</Label>
            <Switch
              id="theme"
              checked={settings.theme === "dark"}
              onCheckedChange={(v) => {
                const updated = { ...settings, theme: (v ? "dark" : "light") as "dark" | "light" };
                saveSettings(updated);
              }}
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
              <Select
                value={settings.model}
                onValueChange={(model) => {
                  const updated = { ...settings, model };
                  saveSettings(updated);
                }}
              >
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
                onValueCommit={([v]) => {
                  const updated = { ...settings, temperature: v };
                  saveSettings(updated);
                }}
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
                onValueCommit={([v]) => {
                  const updated = { ...settings, max_tokens: v };
                  saveSettings(updated);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-4 mt-8 flex items-center justify-between rounded-xl border border-border bg-card/90 p-4 shadow-lg backdrop-blur">
          <span className="text-xs text-muted-foreground">Changes save automatically on selection</span>
          <Button
            onClick={() => saveSettings(settings, true)}
            disabled={update.isPending}
            className="gap-2 font-medium"
          >
            <MessageSquare className="h-4 w-4" /> Save & Return to Chat
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
