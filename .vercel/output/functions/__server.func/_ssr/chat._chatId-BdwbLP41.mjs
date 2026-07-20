import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-jtGBLRa-.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { D as Bot, E as Check, O as ArrowUp, a as Square, b as FileText, i as Trash2, n as X, o as Sparkles, p as Paperclip, r as User, u as RefreshCw, x as Copy } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./chat._chatId-Dh-H1foO.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { a as useMessages, i as useDeleteMessage, o as useProfile, t as AppShell } from "./AppShell-BODebFuq.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._chatId-BdwbLP41.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function MessageBubble({ id, chatId, role, content, streaming }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const deleteMessage = useDeleteMessage();
	const isUser = role === "user";
	const copy = async () => {
		await navigator.clipboard.writeText(content);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	const removeMessage = async () => {
		if (!id || !chatId) return;
		try {
			await deleteMessage.mutateAsync({
				messageId: id,
				chatId
			});
			toast.success("Message deleted");
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("group flex gap-3 px-4 py-6", isUser ? "bg-transparent" : "bg-muted/30"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-3xl gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"),
				children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: isUser ? "You" : "Assistant"
					}), !streaming && id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: copy,
							className: "h-6 w-6 text-muted-foreground hover:text-foreground",
							title: "Copy message",
							children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-green-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: removeMessage,
							className: "h-6 w-6 text-muted-foreground hover:text-destructive",
							title: "Delete message",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background prose-pre:border prose-pre:border-border prose-code:before:content-none prose-code:after:content-none",
					children: [content ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
						remarkPlugins: [remarkGfm],
						children: content
					}) : streaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-4 w-2 animate-pulse bg-foreground/60" }) : null, streaming && content ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-foreground/60 align-middle" }) : null]
				})]
			})]
		})
	});
}
function ChatWindow({ chatId }) {
	const { data: profile } = useProfile();
	const { data: messages = [] } = useMessages(chatId);
	const qc = useQueryClient();
	const [input, setInput] = (0, import_react.useState)("");
	const [streaming, setStreaming] = (0, import_react.useState)(false);
	const [assistantDraft, setAssistantDraft] = (0, import_react.useState)("");
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const abortRef = (0, import_react.useRef)(null);
	const scrollRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, assistantDraft]);
	const handleFileSelect = async (e) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;
		for (const file of files) {
			if (file.size > 15 * 1024 * 1024) {
				toast.error(`File ${file.name} is too large (max 15MB)`);
				continue;
			}
			const isImage = file.type.startsWith("image/");
			const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type.includes("pdf");
			const reader = new FileReader();
			reader.onload = (event) => {
				const result = event.target?.result;
				const newAttachment = {
					id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
					name: file.name,
					type: isImage ? "image" : "file",
					mimeType: file.type || "application/octet-stream",
					data: result,
					previewUrl: isImage ? result : void 0
				};
				setAttachments((prev) => [...prev, newAttachment]);
			};
			if (isImage || isPdf) reader.readAsDataURL(file);
			else reader.readAsText(file);
		}
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const removeAttachment = (id) => {
		setAttachments((prev) => prev.filter((a) => a.id !== id));
	};
	const send = async (content) => {
		if (!content.trim() && attachments.length === 0 || streaming) return;
		const currentAttachments = [...attachments];
		setInput("");
		setAttachments([]);
		setStreaming(true);
		setAssistantDraft("");
		let fullContent = content.trim();
		if (currentAttachments.length > 0) {
			const fileSummaries = currentAttachments.map((a) => {
				if (a.type === "image") return `![${a.name}]`;
				if (a.name.toLowerCase().endsWith(".pdf") || a.mimeType.includes("pdf")) return `📎 [Attached PDF Document: ${a.name}]`;
				return `\n\n--- Attachment: ${a.name} ---\n${a.data.slice(0, 3e3)}\n--- End Attachment ---`;
			}).join("\n");
			fullContent = fullContent ? `${fullContent}\n${fileSummaries}` : fileSummaries;
		}
		qc.setQueryData(["messages", chatId], (old) => [...old ?? [], {
			id: `optimistic-${Date.now()}`,
			chat_id: chatId,
			role: "user",
			content: fullContent,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		const ac = new AbortController();
		abortRef.current = ac;
		try {
			const { data: sess } = await supabase.auth.getSession();
			const token = sess.session?.access_token;
			if (!token) throw new Error("Not signed in");
			const res = await fetch("/api/chat", {
				method: "POST",
				signal: ac.signal,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					chatId,
					content: fullContent,
					model: profile?.settings.model,
					temperature: profile?.settings.temperature,
					maxTokens: profile?.settings.max_tokens,
					language: profile?.settings.language,
					country: profile?.settings.country,
					attachments: currentAttachments.map((a) => ({
						name: a.name,
						type: a.type,
						mimeType: a.mimeType,
						data: a.data
					}))
				})
			});
			if (!res.ok || !res.body) {
				const text = await res.text().catch(() => "");
				throw new Error(text || `Request failed (${res.status})`);
			}
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let acc = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				acc += decoder.decode(value, { stream: true });
				setAssistantDraft(acc);
			}
		} catch (err) {
			if (err.name !== "AbortError") toast.error(err.message || "Something went wrong");
		} finally {
			setStreaming(false);
			setAssistantDraft("");
			abortRef.current = null;
			qc.invalidateQueries({ queryKey: ["messages", chatId] });
			qc.invalidateQueries({ queryKey: ["chats"] });
		}
	};
	const stop = () => abortRef.current?.abort();
	const regenerate = async () => {
		const lastUser = [...messages].reverse().find((m) => m.role === "user");
		if (!lastUser) return;
		const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
		if (lastAssistant && lastAssistant.created_at > lastUser.created_at) await supabase.from("messages").delete().eq("id", lastAssistant.id);
		await supabase.from("messages").delete().eq("id", lastUser.id);
		await qc.invalidateQueries({ queryKey: ["messages", chatId] });
		send(lastUser.content);
	};
	const onKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			send(input);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: scrollRef,
			className: "flex-1 overflow-y-auto",
			children: messages.length === 0 && !streaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col items-center justify-center px-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold tracking-tight",
						children: "How can I help you today?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-sm text-muted-foreground",
						children: "Ask questions, upload images or PDFs for analysis, attach code or documents, brainstorm, and more."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-32",
				children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
					id: m.id,
					chatId,
					role: m.role,
					content: m.content
				}, m.id)), streaming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
					role: "assistant",
					content: assistantDraft,
					streaming: true
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-background/80 px-4 py-4 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl flex-col gap-2",
				children: [
					!streaming && messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: regenerate,
							className: "h-8 gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Regenerate"]
						})
					}),
					attachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 p-2 bg-card rounded-xl border border-border",
						children: attachments.map((att) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group flex items-center gap-2 rounded-lg border bg-background p-1.5 pr-6 text-xs shadow-sm",
							children: [
								att.type === "image" && att.previewUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: att.previewUrl,
									alt: att.name,
									className: "h-10 w-10 object-cover rounded-md"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 max-w-[120px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: att.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground uppercase",
										children: att.name.toLowerCase().endsWith(".pdf") ? "PDF Document" : att.type
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeAttachment(att.id),
									className: "absolute right-1 top-1 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
								})
							]
						}, att.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								ref: fileInputRef,
								onChange: handleFileSelect,
								multiple: true,
								accept: "image/*,.pdf,.txt,.md,.json,.csv,.js,.ts,.tsx,.py",
								className: "hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "icon",
								variant: "ghost",
								onClick: () => fileInputRef.current?.click(),
								className: "h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:text-foreground",
								title: "Attach image or PDF file",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: input,
								onChange: (e) => setInput(e.target.value),
								onKeyDown,
								placeholder: "Message Smart Chatbot AI… (Attach PDFs or images)",
								rows: 1,
								className: "max-h-52 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
							}),
							streaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "destructive",
								onClick: stop,
								className: "h-9 w-9 shrink-0 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								onClick: () => send(input),
								disabled: !input.trim() && attachments.length === 0,
								className: "h-9 w-9 shrink-0 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4 w-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted-foreground",
						children: "AI can make mistakes. Verify important information."
					})
				]
			})
		})]
	});
}
function ChatView() {
	const { chatId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatWindow, { chatId }) });
}
//#endregion
export { ChatView as component };
