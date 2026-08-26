"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChatWidget } from "@/hooks/useChatWidget";
import { httpPublicChatProvider } from "@/lib/chat/httpChatProvider";
import { isPublicChatEnabled } from "@/config/chat";
import { ChatLauncherButton } from "@/components/chat/ChatLauncherButton";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatTabStrip, type ChatTab } from "@/components/chat/ChatTabStrip";
import { ContactUsForm } from "@/components/contact/ContactUsForm";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { computePanelAnchor, resolveLauncherPosition, type PanelAnchor } from "@/components/chat/launcherPosition";
import type { QuickReply } from "@/types/chat";

const GREETING_IDLE_MS = 4000;
const PANEL_SIZE = { width: 380, height: 600 };

/**
 * Public marketing-site widget — merges what used to be two separate floating
 * buttons (the AI chat launcher and `FloatingContactButton`) into one: a single
 * launcher opens one panel with a "Chat" / "Contact us" tab strip
 * (`ChatTabStrip`, rendered via `ChatPanel`'s `contextBar` slot). Chat talks to
 * `/api/chat` via `httpChatProvider`; Contact reuses the existing lead-capture
 * form (`ContactUsForm`) in its `compact` layout.
 */
export function PublicChatWidget() {
  const enabled = isPublicChatEnabled();
  const widget = useChatWidget({ provider: httpPublicChatProvider, variant: "public", enabled });
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [hoverGreeting, setHoverGreeting] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatTab>("chat");
  const [panelAnchor, setPanelAnchor] = useState<PanelAnchor | null>(null);

  useEffect(() => {
    if (widget.open || widget.greetingDismissed) return;
    const timer = setTimeout(() => setHoverGreeting(true), GREETING_IDLE_MS);
    return () => clearTimeout(timer);
  }, [widget.open, widget.greetingDismissed]);

  // Covers the panel being left open across a reload (persisted `open: true`) — the click
  // handler below already sets this synchronously for a normal open, so this is a no-op then.
  useEffect(() => {
    if (widget.open && !panelAnchor) {
      const iconPos = resolveLauncherPosition(widget.position, "bottom-right");
      setPanelAnchor(computePanelAnchor(iconPos, PANEL_SIZE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when open toggles, not on every position/anchor change
  }, [widget.open]);

  if (!enabled) return null;

  const showGreeting = hoverGreeting && !widget.greetingDismissed;

  // "Book a call" has no canned answer worth streaming from the assistant — it's a lead-gen
  // action, so route it straight to the real contact form instead of a text reply.
  const handleQuickReply = (reply: QuickReply) => {
    if (reply.id === "qr_book_call") {
      setActiveTab("contact");
      return;
    }
    widget.sendQuickReply(reply);
  };

  // Compute where the panel should open next to the icon's *current* position — including
  // any drag — right before opening it; no need to track this reactively while closed.
  const openWidget = () => {
    setHoverGreeting(false);
    if (!widget.open) {
      const iconPos = resolveLauncherPosition(widget.position, "bottom-right");
      setPanelAnchor(computePanelAnchor(iconPos, PANEL_SIZE));
    }
    widget.setOpen(!widget.open);
  };

  return (
    <>
      {widget.open && panelAnchor && (
          <ChatPanel
            title={activeTab === "chat" ? "QTO Assistant" : "Contact QTO"}
            messages={widget.messages}
            quickReplies={widget.quickReplies}
            isTyping={widget.isTyping}
            error={widget.error}
            onSend={widget.sendMessage}
            onQuickReply={handleQuickReply}
            onRetry={widget.retryLastMessage}
            onClose={() => widget.setOpen(false)}
            returnFocusRef={launcherRef}
            anchorClassName="w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh]"
            anchorStyle={panelAnchor}
            composerPlaceholder="Ask about services, pricing, or booking a call…"
            bodyMode={activeTab}
            contactBody={
              <div className="flex h-full flex-col">
                <ContactUsForm source="chat-widget" compact />
                <div className="mt-6 border-t border-border pt-4 text-center">
                  <Link
                    href="/contact#contact-form"
                    onClick={() => widget.setOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-primary"
                  >
                    Prefer the full contact page?
                    <AppIcon name="arrow-right" size="sm" className="!text-[10px]" />
                  </Link>
                </div>
              </div>
            }
            header={
              <ChatHeader
                title="QTO Assistant"
                subtitle={activeTab === "chat" ? "Typically replies instantly" : "We reply within one business day"}
                statusColor="green"
                onClose={() => widget.setOpen(false)}
              />
            }
            contextBar={<ChatTabStrip active={activeTab} onChange={setActiveTab} />}
            footer={
              <div className="border-t border-border bg-surface px-4 py-2 text-center text-[11px] text-foreground-muted">
                Powered by QTO
              </div>
            }
          />
      )}

      <ChatLauncherButton
        ref={launcherRef}
        open={widget.open}
        onClick={openWidget}
        onMouseEnter={() => !widget.greetingDismissed && setHoverGreeting(true)}
        unreadCount={widget.unreadCount}
        label={widget.open ? "Close QTO Assistant" : "Open QTO Assistant"}
        greeting="Hi! Need help with anything? 👋"
        showGreeting={showGreeting}
        onDismissGreeting={() => {
          setHoverGreeting(false);
          widget.dismissGreeting();
        }}
        position={widget.position}
        onPositionChange={widget.setPosition}
        defaultCorner="bottom-right"
      />
    </>
  );
}
