"use client";

import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { ChatTimestamp } from "@/components/chat/ChatTimestamp";
import { ChatStructuredCard } from "@/components/chat/ChatStructuredCard";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  className?: string;
}

/** Renders one message — user bubbles right-aligned/filled, assistant left-aligned/outlined. */
export function ChatMessageBubble({ message, className }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex w-full flex-col gap-1", isUser ? "items-end" : "items-start", className)}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "rounded-br-sm bg-primary text-white"
            : "rounded-bl-sm border border-border bg-surface text-foreground"
        )}
      >
        {message.content}
        {message.pending && message.content.length === 0 && (
          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-current opacity-50" />
        )}
      </div>

      {message.attachments && message.attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.attachments.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-foreground-muted hover:text-foreground"
            >
              <AppIcon name="link" size="sm" />
              {attachment.name}
            </a>
          ))}
        </div>
      )}

      {message.structuredData?.map((block) => (
        <ChatStructuredCard key={block.id} data={block} />
      ))}

      <ChatTimestamp isoDate={message.createdAt} />
    </div>
  );
}
