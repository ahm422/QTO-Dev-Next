"use client";

import { useEffect, useRef, useState } from "react";
import { useChatWidget } from "@/hooks/useChatWidget";
import { httpPublicChatProvider } from "@/lib/chat/httpChatProvider";
import { isPublicChatEnabled } from "@/config/chat";
import { ChatLauncherButton } from "@/components/chat/ChatLauncherButton";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ChatHeader } from "@/components/chat/ChatHeader";

const GREETING_IDLE_MS = 4000;

/**
 * Public marketing-site chat widget — "QTO Assistant". Mounted client-only
 * (see `(qtodev)/layout.tsx`), talks to `/api/chat` via `httpChatProvider`.
 */
export function PublicChatWidget() {
  const enabled = isPublicChatEnabled();
  const widget = useChatWidget({ provider: httpPublicChatProvider, variant: "public", enabled });
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [hoverGreeting, setHoverGreeting] = useState(false);

  useEffect(() => {
    if (widget.open || widget.greetingDismissed) return;
    const timer = setTimeout(() => setHoverGreeting(true), GREETING_IDLE_MS);
    return () => clearTimeout(timer);
  }, [widget.open, widget.greetingDismissed]);

  if (!enabled) return null;

  const showGreeting = hoverGreeting && !widget.greetingDismissed;

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-28 md:right-6">
      {widget.open && (
        <div className="mb-3">
          <ChatPanel
            title="QTO Assistant"
            messages={widget.messages}
            quickReplies={widget.quickReplies}
            isTyping={widget.isTyping}
            error={widget.error}
            onSend={widget.sendMessage}
            onQuickReply={widget.sendQuickReply}
            onRetry={widget.retryLastMessage}
            onClose={() => widget.setOpen(false)}
            returnFocusRef={launcherRef}
            anchorClassName="fixed bottom-24 right-4 md:bottom-28 md:right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[75vh]"
            composerPlaceholder="Ask about services, pricing, or booking a call…"
            header={
              <ChatHeader
                title="QTO Assistant"
                subtitle="Typically replies instantly"
                statusColor="green"
                onClose={() => widget.setOpen(false)}
              />
            }
            footer={
              <div className="border-t border-border bg-surface px-4 py-2 text-center text-[11px] text-foreground-muted">
                Powered by QTO
              </div>
            }
          />
        </div>
      )}

      <ChatLauncherButton
        ref={launcherRef}
        open={widget.open}
        onClick={() => {
          setHoverGreeting(false);
          widget.setOpen(!widget.open);
        }}
        onMouseEnter={() => !widget.greetingDismissed && setHoverGreeting(true)}
        unreadCount={widget.unreadCount}
        label={widget.open ? "Close QTO Assistant" : "Open QTO Assistant"}
        greeting="Hi! Need help with anything? 👋"
        showGreeting={showGreeting}
        onDismissGreeting={() => {
          setHoverGreeting(false);
          widget.dismissGreeting();
        }}
      />
    </div>
  );
}
