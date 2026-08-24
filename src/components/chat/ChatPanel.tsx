"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/components/theme/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import { ChatQuickReplies } from "@/components/chat/ChatQuickReplies";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatTypingIndicator } from "@/components/chat/ChatTypingIndicator";
import type { ChatMessage, QuickReply } from "@/types/chat";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ChatPanelProps {
  title: string;
  messages: ChatMessage[];
  quickReplies: QuickReply[];
  isTyping: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onQuickReply: (reply: QuickReply) => void;
  onRetry: () => void;
  onClose: () => void;
  /** Focus is returned here when the panel closes. */
  returnFocusRef: React.RefObject<HTMLElement | null>;
  header: ReactNode;
  footer?: ReactNode;
  contextBar?: ReactNode;
  /** Desktop positioning/sizing classes; overridden by a full-screen sheet below the mobile breakpoint. */
  anchorClassName: string;
  composerPlaceholder?: string;
  className?: string;
}

/**
 * Shared chat panel shell: header + scrollable message list + composer + footer.
 * Owns accessibility behavior (dialog role, focus trap, Escape-to-close, aria-live)
 * and the mobile full-screen sheet breakpoint — variant widgets only supply copy/branding.
 */
export function ChatPanel({
  title,
  messages,
  quickReplies,
  isTyping,
  error,
  onSend,
  onQuickReply,
  onRetry,
  onClose,
  returnFocusRef,
  header,
  footer,
  contextBar,
  anchorClassName,
  composerPlaceholder,
  className,
}: ChatPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const reduceMotion = useReducedMotion();

  // Focus trap + Escape-to-close + focus restoration.
  useEffect(() => {
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const restoreFocusTo = returnFocusRef.current;
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      restoreFocusTo?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per mount, mirroring dialog open/close lifecycle
  }, []);

  // Keep the latest message in view.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isTyping]);

  const lastMessage = messages[messages.length - 1];
  const trailingQuickReplies = !isTyping && lastMessage?.role === "assistant" ? quickReplies : [];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn(
        "z-40 flex flex-col overflow-hidden border border-border bg-background text-foreground shadow-2xl",
        isMobile ? "fixed inset-0 rounded-none" : cn("rounded-2xl", anchorClassName),
        !reduceMotion && "animate-in fade-in slide-in-from-bottom-2 duration-200",
        className
      )}
    >
      {header}
      {contextBar}

      <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <ChatTypingIndicator />}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <AppIcon name="triangle-exclamation" size="sm" />
            <div className="flex-1">
              <p>{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 inline-flex items-center gap-1 font-medium underline underline-offset-2"
              >
                <AppIcon name="rotate-right" size="sm" />
                Retry
              </button>
            </div>
          </div>
        )}

        {trailingQuickReplies.length > 0 && (
          <ChatQuickReplies replies={trailingQuickReplies} onSelect={onQuickReply} />
        )}
      </div>

      <ChatComposer onSend={onSend} disabled={isTyping} placeholder={composerPlaceholder} />

      {footer}
    </div>
  );
}
