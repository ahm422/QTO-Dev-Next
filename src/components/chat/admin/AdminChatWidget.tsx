"use client";

import { useRef } from "react";
import { useChatWidget } from "@/hooks/useChatWidget";
import { httpAdminChatProvider } from "@/lib/chat/httpChatProvider";
import { isAdminChatEnabled } from "@/config/chat";
import { ChatLauncherButton } from "@/components/chat/ChatLauncherButton";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatContextBar } from "@/components/chat/admin/ChatContextBar";

const WIDGET_VERSION = "v2.4";

/**
 * Derives the footer's access-scope label from the admin's role. `src/lib/auth`
 * doesn't expose a dedicated access-scope field today, so this maps the closest
 * equivalent (role) — swap for a real scope claim if one is added later.
 */
function accessScopeForRole(role?: string): string {
  if (role === "editor") return "content-team";
  if (role === "super_admin" || role === "admin") return "ops-team";
  return "ops-team";
}

interface AdminChatWidgetProps {
  userRole?: string;
  ticketId?: string;
  ticketStatus?: string;
  org?: string;
}

/**
 * Admin ops chat widget — "QTO Ops Assistant". Mounted client-only in the admin
 * dashboard layout (auth-gated), talks to `/api/admin/chat` via `httpChatProvider`.
 * Docked bottom-left of the content area, clear of `AdminSidebar`'s 16rem width.
 */
export function AdminChatWidget({
  userRole,
  ticketId = "#TCK-4471",
  ticketStatus = "pending",
  org = "qto-core",
}: AdminChatWidgetProps) {
  const enabled = isAdminChatEnabled();
  const widget = useChatWidget({ provider: httpAdminChatProvider, variant: "admin", enabled });
  const launcherRef = useRef<HTMLButtonElement>(null);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-6 left-4 z-40 lg:left-[17rem]">
      {widget.open && (
        <div className="mb-3">
          <ChatPanel
            title="QTO Ops Assistant"
            messages={widget.messages}
            quickReplies={widget.quickReplies}
            isTyping={widget.isTyping}
            error={widget.error}
            onSend={widget.sendMessage}
            onQuickReply={widget.sendQuickReply}
            onRetry={widget.retryLastMessage}
            onClose={() => widget.setOpen(false)}
            returnFocusRef={launcherRef}
            anchorClassName="fixed bottom-6 left-4 lg:left-[17rem] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh]"
            composerPlaceholder="Ask for logs, the runbook, or to escalate…"
            header={
              <ChatHeader
                title="QTO Ops Assistant"
                subtitle="Internal tools & data"
                statusColor="green"
                badge={WIDGET_VERSION}
                onClose={() => widget.setOpen(false)}
              />
            }
            contextBar={<ChatContextBar ticketId={ticketId} status={ticketStatus} org={org} />}
            footer={
              <div className="border-t border-border bg-surface px-4 py-2 text-center text-[11px] text-foreground-muted">
                QTO internal · access-scope: {accessScopeForRole(userRole)}
              </div>
            }
          />
        </div>
      )}

      <ChatLauncherButton
        ref={launcherRef}
        open={widget.open}
        onClick={() => widget.setOpen(!widget.open)}
        unreadCount={widget.unreadCount}
        label={widget.open ? "Close QTO Ops Assistant" : "Open QTO Ops Assistant"}
      />
    </div>
  );
}
