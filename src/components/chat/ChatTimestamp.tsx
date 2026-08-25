"use client";

import { cn } from "@/components/theme/cn";

interface ChatTimestampProps {
  isoDate: string;
  className?: string;
}

/** Renders a message time as HH:MM in the viewer's locale. */
export function ChatTimestamp({ isoDate, className }: ChatTimestampProps) {
  const time = new Date(isoDate).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <time dateTime={isoDate} className={cn("text-[11px] text-foreground-muted", className)}>
      {time}
    </time>
  );
}
