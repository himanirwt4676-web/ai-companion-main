import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AppSidebar } from "./AppSidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="hidden w-72 shrink-0 md:block">
        <AppSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-2 border-b border-border px-3 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <VisuallyHidden>
                <SheetTitle>Navigation</SheetTitle>
              </VisuallyHidden>
              <AppSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-medium">Smart Chatbot AI</span>
        </header>
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
