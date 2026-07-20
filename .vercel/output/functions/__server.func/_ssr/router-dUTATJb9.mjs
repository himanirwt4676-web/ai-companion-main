import { i as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-jtGBLRa-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as redirect, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$10 } from "./chat._chatId-Dh-H1foO.mjs";
import { r as Route$11 } from "./settings-B5TveqA1.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as streamText } from "../_libs/ai.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
import path from "path";
import fs from "fs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-dUTATJb9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BP4l27Qt.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try again or head home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Smart Chatbot AI — Your thinking partner" },
			{
				name: "description",
				content: "A fast, clean AI chatbot with saved history, model choice, and streaming responses."
			},
			{
				name: "author",
				content: "Smart Chatbot AI"
			},
			{
				property: "og:title",
				content: "Smart Chatbot AI"
			},
			{
				property: "og:description",
				content: "Chat with a smart AI assistant. Save, search, and continue conversations."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-center"
		})]
	});
}
var BASE_URL = "";
var Route$8 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		}, {
			path: "/auth",
			changefreq: "monthly",
			priority: "0.5"
		}].map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$6 = () => import("./reset-password-C8Sr34I1.mjs");
var Route$7 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — Smart Chatbot AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./auth-DlfYZq3L.mjs");
var Route$6 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — Smart Chatbot AI" }, {
		name: "description",
		content: "Sign in or create an account to chat with Smart Chatbot AI."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./route-Di7iQBCH.mjs");
var Route$5 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./routes-Dd0cZr7w.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
function getEnvVar$1(name) {
	if (process.env[name]) return process.env[name];
	try {
		const envPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const content = fs.readFileSync(envPath, "utf-8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (trimmed.startsWith(`${name}=`)) return trimmed.slice(name.length + 1).trim();
			}
		}
	} catch {}
}
function getAiProvider() {
	const lovableApiKey = getEnvVar$1("LOVABLE_API_KEY") || getEnvVar$1("VITE_LOVABLE_API_KEY");
	const geminiApiKey = getEnvVar$1("GEMINI_API_KEY") || getEnvVar$1("VITE_GEMINI_API_KEY");
	const openAiApiKey = getEnvVar$1("OPENAI_API_KEY") || getEnvVar$1("VITE_OPENAI_API_KEY");
	const groqApiKey = getEnvVar$1("GROQ_API_KEY") || getEnvVar$1("VITE_GROQ_API_KEY");
	if (lovableApiKey) return createOpenAICompatible({
		name: "lovable",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: {
			"Lovable-API-Key": lovableApiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		}
	});
	if (geminiApiKey) return createOpenAICompatible({
		name: "gemini",
		baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
		apiKey: geminiApiKey
	});
	if (openAiApiKey) return createOpenAICompatible({
		name: "openai",
		baseURL: "https://api.openai.com/v1",
		apiKey: openAiApiKey
	});
	if (groqApiKey) return createOpenAICompatible({
		name: "groq",
		baseURL: "https://api.groq.com/openai/v1",
		apiKey: groqApiKey
	});
	return null;
}
var LANGUAGE_NAMES = {
	en: "English",
	es: "Spanish (Español)",
	hi: "Hindi (हिन्दी)",
	fr: "French (Français)",
	de: "German (Deutsch)",
	ja: "Japanese (日本語)",
	zh: "Chinese (中文)",
	pt: "Portuguese (Português)",
	ar: "Arabic (العربية)",
	ru: "Russian (Русский)",
	it: "Italian (Italiano)",
	ko: "Korean (한국어)"
};
var COUNTRY_NAMES = {
	US: "United States",
	IN: "India",
	GB: "United Kingdom",
	CA: "Canada",
	AU: "Australia",
	DE: "Germany",
	FR: "France",
	JP: "Japan",
	CN: "China",
	BR: "Brazil",
	AE: "United Arab Emirates",
	SA: "Saudi Arabia",
	MX: "Mexico",
	IT: "Italy",
	ES: "Spain",
	SG: "Singapore",
	ZA: "South Africa",
	KR: "South Korea"
};
function getEnvVar(name) {
	if (process.env[name]) return process.env[name];
	try {
		const envPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const content = fs.readFileSync(envPath, "utf-8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (trimmed.startsWith(`${name}=`)) return trimmed.slice(name.length + 1).trim();
			}
		}
	} catch {}
}
var Route$3 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	const supabaseUrl = getEnvVar("SUPABASE_URL") || getEnvVar("VITE_SUPABASE_URL");
	const supabaseKey = getEnvVar("SUPABASE_PUBLISHABLE_KEY") || getEnvVar("VITE_SUPABASE_PUBLISHABLE_KEY");
	if (!supabaseUrl || !supabaseKey) return new Response("Supabase not configured in .env file (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing)", { status: 500 });
	const provider = getAiProvider();
	if (!provider) return new Response("AI API Key missing! Please add GEMINI_API_KEY, LOVABLE_API_KEY, or OPENAI_API_KEY to your .env file.", { status: 500 });
	const auth = request.headers.get("authorization") ?? "";
	const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
	if (!token) return new Response("Unauthorized - Please sign in", { status: 401 });
	const supabase = createClient(supabaseUrl, supabaseKey, {
		global: { headers: { Authorization: `Bearer ${token}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data: userData, error: userErr } = await supabase.auth.getUser(token);
	if (userErr || !userData.user) return new Response("Unauthorized user", { status: 401 });
	const userId = userData.user.id;
	const body = await request.json();
	if (!body?.chatId || !body?.content?.trim() && (!body?.attachments || body.attachments.length === 0)) return new Response("Bad request - chatId and content or attachments required", { status: 400 });
	const { data: chat } = await supabase.from("chats").select("id, title").eq("id", body.chatId).maybeSingle();
	if (!chat) return new Response("Chat not found", { status: 404 });
	let extractedPdfText = "";
	for (const att of body.attachments || []) if (att.name.toLowerCase().endsWith(".pdf") || att.mimeType.includes("pdf")) try {
		const { extractText, getDocumentProxy } = await import("../_libs/unpdf.mjs").then((n) => n.t);
		const base64Str = att.data.includes(";base64,") ? att.data.split(";base64,")[1] : att.data;
		const buffer = Buffer.from(base64Str, "base64");
		const { text } = await extractText(await getDocumentProxy(new Uint8Array(buffer)), { mergePages: false });
		if (Array.isArray(text) && text.length > 0) {
			const pagesFormatted = text.map((pageText, idx) => `--- Page ${idx + 1} ---\n${pageText.trim()}`).filter((p) => p.length > 18).join("\n\n");
			if (pagesFormatted.trim()) extractedPdfText += `\n\n=== Extracted PDF Text (${att.name} - ${text.length} Pages) ===\n${pagesFormatted}\n=== End Extracted PDF Text ===`;
		} else if (typeof text === "string" && text.trim()) extractedPdfText += `\n\n=== Extracted PDF Text (${att.name}) ===\n${text.trim()}\n=== End Extracted PDF Text ===`;
	} catch (pdfErr) {
		console.error("[unpdf Extraction Error]:", pdfErr);
	}
	const combinedUserText = (body.content + extractedPdfText).trim();
	await supabase.from("messages").insert({
		chat_id: body.chatId,
		user_id: userId,
		role: "user",
		content: combinedUserText
	});
	if (chat.title === "New chat") {
		const title = (body.content || "Attached document").trim().slice(0, 60);
		await supabase.from("chats").update({ title }).eq("id", body.chatId);
	} else await supabase.from("chats").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", body.chatId);
	const { data: history } = await supabase.from("messages").select("role, content").eq("chat_id", body.chatId).order("created_at", { ascending: true });
	const historyMessages = (history ?? []).slice(0, -1).filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({
		role: m.role,
		content: m.content
	}));
	const imageAttachments = (body.attachments || []).filter((a) => a.type === "image" && a.data);
	let latestUserContent = combinedUserText;
	if (imageAttachments.length > 0) latestUserContent = [{
		type: "text",
		text: combinedUserText || "Please analyze the attached image(s)."
	}, ...imageAttachments.map((img) => ({
		type: "image",
		image: img.data
	}))];
	const messages = [...historyMessages, {
		role: "user",
		content: latestUserContent
	}];
	const now = /* @__PURE__ */ new Date();
	const formattedDate = now.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	const formattedTime = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short"
	});
	const userLangCode = body.language || "en";
	const userLangName = LANGUAGE_NAMES[userLangCode] || "English";
	const userCountryCode = body.country || "US";
	const userCountryName = COUNTRY_NAMES[userCountryCode] || userCountryCode;
	const systemPrompt = `You are Smart Chatbot AI, a highly intelligent, universal AI assistant with advanced Multimodal Vision and Document Intelligence capabilities.

CREATOR & OWNER INFORMATION:
- Your Owner, Creator, and Developer is Subham.
- Whenever anyone asks "who is your owner?", "who created you?", "who developed you?", or "who made you?", you MUST answer that you were developed and created by Subham.

REAL-TIME CONTEXT DATA:
- Current Date: ${formattedDate} (${now.toISOString().split("T")[0]})
- Current Time: ${formattedTime}
- System Timestamp: ${now.toISOString()}
- User Location / Country Context: ${userCountryName} (${userCountryCode})
- Preferred Language: ${userLangName} (${userLangCode})

MANDATORY INSTRUCTIONS:
1. CREATOR CREDITS: Whenever asked about your owner, creator, or developer, state proudly that you were created and developed by Subham.
2. UNIVERSAL PDF & IMAGE ANALYSIS: You can study, read, and explain ANY PDF (text-based PDFs, scanned PDFs, hand-written documents, forms, research papers, contracts, invoices) and ANY Image (diagrams, screenshots, photos, charts). Analyze the document/image thoroughly and answer any questions asked by the user.
3. PAGE-BY-PAGE ACCURACY: When a multi-page PDF is attached, text is provided with page markers ('--- Page 1 ---', '--- Page 2 ---', etc.). When the user asks about specific pages (e.g. "explain page 1", "what is on page 2", "summarize page 3"), answer accurately for that specific page.
4. REAL-TIME ACCURACY: You have direct awareness of the exact current date, time, and timezone listed above. Give exact answers for date/time/location queries.
5. MULTILINGUAL RESPONSES: All your answers MUST be written in ${userLangName} unless the user explicitly requests another language.
6. FORMATTING: Use clean, beautiful Markdown formatting, bold headings, bullet points, and syntax-highlighted code blocks.`;
	const GEMINI_MODELS = [
		"gemini-2.5-flash",
		"gemini-2.0-flash",
		"gemini-2.5-pro"
	];
	let resultStream = null;
	let lastErrorMsg = "";
	for (const mName of GEMINI_MODELS) try {
		resultStream = streamText({
			model: provider(mName),
			system: systemPrompt,
			messages,
			temperature: body.temperature ?? .7,
			maxOutputTokens: body.maxTokens ?? 2048
		});
		break;
	} catch (err) {
		lastErrorMsg = err instanceof Error ? err.message : String(err);
		console.warn(`[Model Fallback Warning]: ${mName} failed:`, lastErrorMsg);
	}
	let assistantText = "";
	const encoder = new TextEncoder();
	const stream = new ReadableStream({ async start(controller) {
		try {
			if (resultStream) for await (const delta of resultStream.textStream) {
				assistantText += delta;
				controller.enqueue(encoder.encode(delta));
			}
			else {
				assistantText = `⚠️ **Google AI Studio Rate Limit Reached (429 Too Many Requests)**\n\nYour API key has temporarily reached its Google Free Tier quota. Please wait ~30 seconds or add a fresh \`GEMINI_API_KEY\` in your \`.env\` file.`;
				controller.enqueue(encoder.encode(assistantText));
			}
			controller.close();
		} catch (err) {
			const message = err instanceof Error ? err.message : "API Error";
			console.error("[Stream Error]:", message);
			assistantText = `⚠️ **Google AI Studio Quota Limit**: ${message}\n\nPlease wait a few seconds or check your GEMINI_API_KEY in \`.env\`.`;
			controller.enqueue(encoder.encode(assistantText));
			controller.close();
		} finally {
			if (assistantText.trim()) await supabase.from("messages").insert({
				chat_id: body.chatId,
				user_id: userId,
				role: "assistant",
				content: assistantText
			});
		}
	} });
	return new Response(stream, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "no-cache, no-transform",
		"X-Accel-Buffering": "no"
	} });
} } } });
var $$splitComponentImporter$2 = () => import("./profile-B6udmAw8.mjs");
var Route$2 = createFileRoute("/_authenticated/profile")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./chat-BBRTXnxF.mjs");
var Route$1 = createFileRoute("/_authenticated/chat")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./chat.index-C53JoxYP.mjs");
var Route = createFileRoute("/_authenticated/chat/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SitemapDotxmlRoute = Route$8.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$9
});
var ResetPasswordRoute = Route$7.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$9
});
var AuthRoute = Route$6.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRoute = Route$5.update({
	id: "/_authenticated",
	getParentRoute: () => Route$9
});
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var ApiChatRoute = Route$3.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$9
});
var AuthenticatedSettingsRoute = Route$11.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$2.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedChatRoute = Route$1.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedChatIndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedChatRoute
});
var AuthenticatedChatRouteChildren = {
	AuthenticatedChatChatIdRoute: Route$10.update({
		id: "/$chatId",
		path: "/$chatId",
		getParentRoute: () => AuthenticatedChatRoute
	}),
	AuthenticatedChatIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedChatRoute: AuthenticatedChatRoute._addFileChildren(AuthenticatedChatRouteChildren),
	AuthenticatedProfileRoute,
	AuthenticatedSettingsRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ResetPasswordRoute,
	SitemapDotxmlRoute,
	ApiChatRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
