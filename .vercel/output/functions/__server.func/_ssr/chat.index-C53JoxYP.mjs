import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { d as Plus, o as Sparkles } from "../_libs/lucide-react.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useChats, r as useCreateChat, t as AppShell } from "./AppShell-BODebFuq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat.index-C53JoxYP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatIndex() {
	const { data: chats, isLoading, isError } = useChats();
	const createChat = useCreateChat();
	const navigate = useNavigate();
	const creatingRef = (0, import_react.useRef)(false);
	const handleCreateNew = async () => {
		if (creatingRef.current) return;
		creatingRef.current = true;
		try {
			navigate({
				to: "/chat/$chatId",
				params: { chatId: (await createChat.mutateAsync()).id },
				replace: true
			});
		} catch (e) {
			creatingRef.current = false;
		}
	};
	(0, import_react.useEffect)(() => {
		if (chats && chats.length > 0) {
			navigate({
				to: "/chat/$chatId",
				params: { chatId: chats[0].id },
				replace: true
			});
			return;
		}
		if (!isLoading || isError) {
			handleCreateNew();
			return;
		}
		const timer = setTimeout(() => {
			if (!chats || chats.length === 0) handleCreateNew();
		}, 1200);
		return () => clearTimeout(timer);
	}, [
		isLoading,
		isError,
		chats?.length
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted-foreground mb-4",
				children: "Starting your chat session…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: handleCreateNew,
				disabled: createChat.isPending,
				variant: "outline",
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Start New Chat Now"]
			})
		]
	}) });
}
//#endregion
export { ChatIndex as component };
