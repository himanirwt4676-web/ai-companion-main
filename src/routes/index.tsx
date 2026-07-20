import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles, MessageSquare, Zap, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/chat", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Smart Chatbot AI</span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get started</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Powered by frontier AI
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            Your thinking partner,
            <br />
            <span className="text-primary">always on.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            A clean, fast AI chat that remembers every conversation. Ask anything, get code, draft
            copy, or brainstorm ideas — with the model, temperature, and tone you prefer.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth">Start chatting free</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
          <Feature icon={<MessageSquare className="h-5 w-5" />} title="Full chat history" desc="Every conversation saved, searchable, and easy to revisit." />
          <Feature icon={<Zap className="h-5 w-5" />} title="Streaming responses" desc="Answers arrive as they’re generated — with stop and regenerate." />
          <Feature icon={<Shield className="h-5 w-5" />} title="Yours alone" desc="Row-level security ensures no one else can see your chats." />
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Built with Lovable Cloud & Lovable AI
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
