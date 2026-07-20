import { useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Plus, MessageSquare, Search, Trash2, Pencil, Settings, User, LogOut, Sparkles, RefreshCw, Archive } from "lucide-react";
import { toast } from "sonner";
import { useChats, useCreateChat, useSoftDeleteChat, useRestoreChat, usePermanentDeleteChat, useRenameChat, useRecycleBin } from "@/hooks/useChats";
import { useProfile } from "@/hooks/useProfile";
import { LANGUAGES, COUNTRIES } from "@/routes/_authenticated/settings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { chatId?: string };
  const { data: chats = [] } = useChats();
  const { data: recycledChats = [] } = useRecycleBin();
  const { data: profile } = useProfile();
  const createChat = useCreateChat();
  const softDeleteChat = useSoftDeleteChat();
  const restoreChat = useRestoreChat();
  const permanentDeleteChat = usePermanentDeleteChat();
  const renameChat = useRenameChat();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  const filtered = chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const currentLang = LANGUAGES.find((l) => l.code === (profile?.settings.language || "en")) || LANGUAGES[0];
  const currentCountry = COUNTRIES.find((c) => c.code === (profile?.settings.country || "US")) || COUNTRIES[0];

  const newChat = async () => {
    const chat = await createChat.mutateAsync();
    onNavigate?.();
    navigate({ to: "/chat/$chatId", params: { chatId: chat.id } });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const commitRename = async (id: string) => {
    const title = editValue.trim();
    if (title && title.length <= 100) {
      await renameChat.mutateAsync({ id, title });
    }
    setEditingId(null);
    setEditValue("");
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-3 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight">Smart Chatbot</span>
      </div>

      <div className="p-3">
        <Button onClick={newChat} className="w-full justify-start gap-2" variant="outline">
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {filtered.length === 0 ? (
          <p className="px-3 py-8 text-center text-xs text-muted-foreground">
            {chats.length === 0 ? "No active chats." : "No matches."}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((c) => {
              const active = params.chatId === c.id;
              return (
                <li key={c.id}>
                  {editingId === c.id ? (
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => commitRename(c.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename(c.id);
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditValue("");
                        }
                      }}
                      className="h-8 text-sm"
                    />
                  ) : (
                    <div
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60",
                      )}
                    >
                      <Link
                        to="/chat/$chatId"
                        params={{ chatId: c.id }}
                        onClick={onNavigate}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{c.title}</span>
                      </Link>
                      <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditValue(c.title);
                          }}
                          className="rounded p-1 hover:bg-sidebar-accent"
                          aria-label="Rename"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setPendingDelete(c.id)}
                          className="rounded p-1 hover:bg-destructive/20 hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Recycle Bin Button */}
      <div className="px-2 py-1.5 border-t border-sidebar-border">
        <button
          onClick={() => setShowRecycleBin(true)}
          className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <span className="flex items-center gap-2">
            <Archive className="h-3.5 w-3.5" /> Recycle Bin (30 days)
          </span>
          {recycledChats.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {recycledChats.length}
            </Badge>
          )}
        </button>
      </div>

      {/* Quick Language & Country Context Badge */}
      <div className="px-3 py-2 border-t border-sidebar-border bg-sidebar-accent/30 text-xs text-muted-foreground flex items-center justify-between">
        <Link to="/settings" className="flex items-center gap-1.5 hover:text-foreground">
          <span>{currentLang.flag} {currentLang.label.split(" ")[0]}</span>
          <span>•</span>
          <span>{currentCountry.flag} {currentCountry.code}</span>
        </Link>
        <Link to="/settings" className="hover:text-foreground">
          <Settings className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-sidebar-accent">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {(profile?.name ?? "U").charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{profile?.name ?? "Account"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut().catch((e) => toast.error(e.message));
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Move to Recycle Bin Confirmation */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move chat to Recycle Bin?</AlertDialogTitle>
            <AlertDialogDescription>
              This chat will be moved to the Recycle Bin and retained for 30 days before automatic deletion. You can restore it anytime within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!pendingDelete) return;
                const id = pendingDelete;
                setPendingDelete(null);
                await softDeleteChat.mutateAsync(id);
                toast.success("Moved to Recycle Bin (30-day retention)");
                if (params.chatId === id) navigate({ to: "/chat" });
              }}
            >
              Move to Recycle Bin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recycle Bin Dialog */}
      <Dialog open={showRecycleBin} onOpenChange={setShowRecycleBin}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-primary" /> Recycle Bin
            </DialogTitle>
            <DialogDescription>
              Deleted chats are kept here for 30 days. You can restore them or delete them permanently.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 overflow-y-auto space-y-2 py-2">
            {recycledChats.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Recycle Bin is empty.
              </p>
            ) : (
              recycledChats.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.daysLeft} {c.daysLeft === 1 ? "day" : "days"} remaining
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await restoreChat.mutateAsync(c.id);
                        toast.success("Chat restored successfully");
                      }}
                      className="h-8 gap-1 text-xs"
                    >
                      <RefreshCw className="h-3 w-3" /> Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await permanentDeleteChat.mutateAsync(c.id);
                        toast.success("Permanently deleted");
                      }}
                      className="h-8 gap-1 text-xs"
                    >
                      <Trash2 className="h-3 w-3" /> Delete Forever
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
