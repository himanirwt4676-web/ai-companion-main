import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-jtGBLRa-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime, a as Overlay2, c as Title2, d as Description, f as Overlay, g as Trigger, h as Title, i as Description2, l as Close, m as Root, n as Cancel, o as Portal2, p as Portal, r as Content2, s as Root2, t as Action, u as Content } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { A as Archive, E as Check, S as Circle, _ as LogOut, c as Settings, d as Plus, f as Pencil, h as Menu, i as Trash2, l as Search, m as MessageSquare, n as X, o as Sparkles, r as User, u as RefreshCw, w as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-DpVSPs6K.mjs";
import { _ as useParams, g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Label2, c as Root2$1, d as SubTrigger2, f as Trigger$1, i as ItemIndicator2, l as Separator2, n as Content2$1, o as Portal2$1, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as LANGUAGES, t as COUNTRIES } from "./settings-B5TveqA1.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { g as VisuallyHidden } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-BODebFuq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Root;
var SheetTrigger = Trigger;
var SheetPortal = Portal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = Title.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = Description.displayName;
var LOCAL_RECYCLE_BIN_KEY = "ai_companion_recycle_bin_v1";
function getLocalRecycleBin() {
	try {
		const raw = localStorage.getItem(LOCAL_RECYCLE_BIN_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function saveLocalRecycleBin(items) {
	try {
		localStorage.setItem(LOCAL_RECYCLE_BIN_KEY, JSON.stringify(items));
	} catch {}
}
function getLocalDeletedIds() {
	return getLocalRecycleBin().map((i) => i.id);
}
function useChats() {
	return useQuery({
		queryKey: ["chats"],
		staleTime: 1e3 * 5,
		queryFn: async () => {
			const localDeleted = getLocalDeletedIds();
			try {
				const { data, error } = await supabase.from("chats").select("id, title, created_at, updated_at, deleted_at").is("deleted_at", null).order("updated_at", { ascending: false });
				if (!error && data) return data.filter((c) => !localDeleted.includes(c.id));
			} catch (e) {
				console.warn("[useChats fallback]: deleted_at query failed, attempting standard query", e);
			}
			const { data, error } = await supabase.from("chats").select("id, title, created_at, updated_at").order("updated_at", { ascending: false });
			if (error) throw error;
			return (data ?? []).filter((c) => !localDeleted.includes(c.id));
		}
	});
}
function useRecycleBin() {
	return useQuery({
		queryKey: ["recycle-bin"],
		queryFn: async () => {
			const now = Date.now();
			const localItems = getLocalRecycleBin();
			let remoteItems = [];
			try {
				const { data, error } = await supabase.from("chats").select("id, title, created_at, updated_at, deleted_at").not("deleted_at", "is", null).order("deleted_at", { ascending: false });
				if (!error && data) remoteItems = data;
			} catch (e) {
				console.warn("[useRecycleBin fallback]: remote query skipped", e);
			}
			const mergedMap = /* @__PURE__ */ new Map();
			for (const item of remoteItems) if (item.deleted_at) mergedMap.set(item.id, item);
			for (const item of localItems) if (!mergedMap.has(item.id)) mergedMap.set(item.id, item);
			const activeDeleted = [];
			const expiredIds = [];
			for (const item of mergedMap.values()) if (item.deleted_at) {
				const deletedTime = new Date(item.deleted_at).getTime();
				const daysPassed = Math.floor((now - deletedTime) / (1e3 * 60 * 60 * 24));
				const daysLeft = Math.max(0, 30 - daysPassed);
				if (daysPassed >= 30) expiredIds.push(item.id);
				else activeDeleted.push({
					...item,
					daysLeft
				});
			}
			if (expiredIds.length > 0) {
				saveLocalRecycleBin(localItems.filter((i) => !expiredIds.includes(i.id)));
				supabase.from("chats").delete().in("id", expiredIds).then(() => {});
			}
			return activeDeleted;
		}
	});
}
function useMessages(chatId) {
	return useQuery({
		queryKey: ["messages", chatId],
		enabled: !!chatId,
		queryFn: async () => {
			const { data, error } = await supabase.from("messages").select("id, chat_id, role, content, created_at").eq("chat_id", chatId).order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useCreateChat() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const { data: userData } = await supabase.auth.getUser();
			if (!userData.user) throw new Error("Not signed in");
			const { data, error } = await supabase.from("chats").insert({
				user_id: userData.user.id,
				title: "New chat"
			}).select("id, title, created_at, updated_at").single();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["chats"] });
		}
	});
}
function useSoftDeleteChat() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { data: chat } = await supabase.from("chats").select("id, title, created_at, updated_at").eq("id", id).maybeSingle();
			const deletedAt = (/* @__PURE__ */ new Date()).toISOString();
			if (chat) {
				const local = getLocalRecycleBin();
				saveLocalRecycleBin([{
					...chat,
					deleted_at: deletedAt
				}, ...local.filter((i) => i.id !== id)]);
			}
			try {
				await supabase.from("chats").update({ deleted_at: deletedAt }).eq("id", id);
			} catch (e) {
				console.warn("[softDeleteChat] DB update skipped", e);
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["chats"] });
			qc.invalidateQueries({ queryKey: ["recycle-bin"] });
		}
	});
}
function useRestoreChat() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			saveLocalRecycleBin(getLocalRecycleBin().filter((i) => i.id !== id));
			try {
				await supabase.from("chats").update({ deleted_at: null }).eq("id", id);
			} catch (e) {
				console.warn("[restoreChat] DB update skipped", e);
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["chats"] });
			qc.invalidateQueries({ queryKey: ["recycle-bin"] });
		}
	});
}
function usePermanentDeleteChat() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			saveLocalRecycleBin(getLocalRecycleBin().filter((i) => i.id !== id));
			const { error } = await supabase.from("chats").delete().eq("id", id);
			if (error) console.warn("[permanentDeleteChat] error", error);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["chats"] });
			qc.invalidateQueries({ queryKey: ["recycle-bin"] });
		}
	});
}
function useDeleteMessage() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ messageId, chatId }) => {
			const { error } = await supabase.from("messages").delete().eq("id", messageId);
			if (error) throw error;
			return { chatId };
		},
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: ["messages", vars.chatId] });
		}
	});
}
function useRenameChat() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, title }) => {
			const { error } = await supabase.from("chats").update({ title }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["chats"] })
	});
}
var DEFAULT_SETTINGS = {
	theme: "dark",
	model: "google/gemini-3-flash-preview",
	temperature: .7,
	max_tokens: 2048,
	language: "en",
	country: "US"
};
function useProfile() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const { data: userData } = await supabase.auth.getUser();
			if (!userData.user) return null;
			const { data, error } = await supabase.from("profiles").select("id, name, avatar_url, settings").eq("id", userData.user.id).maybeSingle();
			if (error) throw error;
			if (!data) return null;
			return {
				...data,
				settings: {
					...DEFAULT_SETTINGS,
					...data.settings ?? {}
				}
			};
		}
	});
}
function useUpdateProfile() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (patch) => {
			const { data: userData } = await supabase.auth.getUser();
			if (!userData.user) throw new Error("Not signed in");
			const { error } = await supabase.from("profiles").update(patch).eq("id", userData.user.id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] })
	});
}
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var DropdownMenu = Root2$1;
var DropdownMenuTrigger = Trigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function AppSidebar({ onNavigate }) {
	const navigate = useNavigate();
	const params = useParams({ strict: false });
	const { data: chats = [] } = useChats();
	const { data: recycledChats = [] } = useRecycleBin();
	const { data: profile } = useProfile();
	const createChat = useCreateChat();
	const softDeleteChat = useSoftDeleteChat();
	const restoreChat = useRestoreChat();
	const permanentDeleteChat = usePermanentDeleteChat();
	const renameChat = useRenameChat();
	const [search, setSearch] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editValue, setEditValue] = (0, import_react.useState)("");
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [showRecycleBin, setShowRecycleBin] = (0, import_react.useState)(false);
	const filtered = chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
	const currentLang = LANGUAGES.find((l) => l.code === (profile?.settings.language || "en")) || LANGUAGES[0];
	const currentCountry = COUNTRIES.find((c) => c.code === (profile?.settings.country || "US")) || COUNTRIES[0];
	const newChat = async () => {
		const chat = await createChat.mutateAsync();
		onNavigate?.();
		navigate({
			to: "/chat/$chatId",
			params: { chatId: chat.id }
		});
	};
	const signOut = async () => {
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	const commitRename = async (id) => {
		const title = editValue.trim();
		if (title && title.length <= 100) await renameChat.mutateAsync({
			id,
			title
		});
		setEditingId(null);
		setEditValue("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full w-full flex-col border-r border-border bg-sidebar text-sidebar-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-sidebar-border px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold tracking-tight",
					children: "Smart Chatbot"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: newChat,
					className: "w-full justify-start gap-2",
					variant: "outline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New chat"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search chats",
						className: "h-8 pl-8 text-sm"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-2 pb-2",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-8 text-center text-xs text-muted-foreground",
					children: chats.length === 0 ? "No active chats." : "No matches."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-0.5",
					children: filtered.map((c) => {
						const active = params.chatId === c.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: editingId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							autoFocus: true,
							value: editValue,
							onChange: (e) => setEditValue(e.target.value),
							onBlur: () => commitRename(c.id),
							onKeyDown: (e) => {
								if (e.key === "Enter") commitRename(c.id);
								if (e.key === "Escape") {
									setEditingId(null);
									setEditValue("");
								}
							},
							className: "h-8 text-sm"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/chat/$chatId",
								params: { chatId: c.id },
								onClick: onNavigate,
								className: "flex min-w-0 flex-1 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5 shrink-0 opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: c.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex opacity-0 transition-opacity group-hover:opacity-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setEditingId(c.id);
										setEditValue(c.title);
									},
									className: "rounded p-1 hover:bg-sidebar-accent",
									"aria-label": "Rename",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPendingDelete(c.id),
									className: "rounded p-1 hover:bg-destructive/20 hover:text-destructive",
									"aria-label": "Delete",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
								})]
							})]
						}) }, c.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-2 py-1.5 border-t border-sidebar-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowRecycleBin(true),
					className: "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" }), " Recycle Bin (30 days)"]
					}), recycledChats.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "h-5 px-1.5 text-[10px]",
						children: recycledChats.length
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 py-2 border-t border-sidebar-border bg-sidebar-accent/30 text-xs text-muted-foreground flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/settings",
					className: "flex items-center gap-1.5 hover:text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							currentLang.flag,
							" ",
							currentLang.label.split(" ")[0]
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							currentCountry.flag,
							" ",
							currentCountry.code
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: "hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3.5 w-3.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-sidebar-border p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-sidebar-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground",
							children: (profile?.name ?? "U").charAt(0).toUpperCase()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: profile?.name ?? "Account"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					side: "top",
					className: "w-56",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => navigate({ to: "/profile" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mr-2 h-4 w-4" }), " Profile"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => navigate({ to: "/settings" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 h-4 w-4" }), " Settings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => {
								signOut().catch((e) => toast.error(e.message));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!pendingDelete,
				onOpenChange: (o) => !o && setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Move chat to Recycle Bin?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This chat will be moved to the Recycle Bin and retained for 30 days before automatic deletion. You can restore it anytime within 30 days." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: async () => {
						if (!pendingDelete) return;
						const id = pendingDelete;
						setPendingDelete(null);
						await softDeleteChat.mutateAsync(id);
						toast.success("Moved to Recycle Bin (30-day retention)");
						if (params.chatId === id) navigate({ to: "/chat" });
					},
					children: "Move to Recycle Bin"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showRecycleBin,
				onOpenChange: setShowRecycleBin,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-5 w-5 text-primary" }), " Recycle Bin"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Deleted chats are kept here for 30 days. You can restore them or delete them permanently." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-80 overflow-y-auto space-y-2 py-2",
						children: recycledChats.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "Recycle Bin is empty."
						}) : recycledChats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 pr-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium text-sm",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										c.daysLeft,
										" ",
										c.daysLeft === 1 ? "day" : "days",
										" remaining"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: async () => {
										await restoreChat.mutateAsync(c.id);
										toast.success("Chat restored successfully");
									},
									className: "h-8 gap-1 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Restore"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "destructive",
									onClick: async () => {
										await permanentDeleteChat.mutateAsync(c.id);
										toast.success("Permanently deleted");
									},
									className: "h-8 gap-1 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), " Delete Forever"]
								})]
							})]
						}, c.id))
					})]
				})
			})
		]
	});
}
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen w-full overflow-hidden bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden w-72 shrink-0 md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-12 items-center gap-2 border-b border-border px-3 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
						side: "left",
						className: "w-72 p-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisuallyHidden, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Navigation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, { onNavigate: () => setOpen(false) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: "Smart Chatbot AI"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-h-0 flex-1",
				children
			})]
		})]
	});
}
//#endregion
export { useMessages as a, useDeleteMessage as i, useChats as n, useProfile as o, useCreateChat as r, useUpdateProfile as s, AppShell as t };
