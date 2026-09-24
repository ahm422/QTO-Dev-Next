"use client";

import { useCallback, useState } from "react";
import type { ChatVariant } from "@/types/chat";

export interface ChatLauncherPosition {
  x: number;
  y: number;
}

interface PersistedChatState {
  sessionId: string;
  open: boolean;
  unreadCount: number;
  /** Ids of greeting bubbles the visitor has already dismissed, so they don't reappear. */
  dismissedGreetings: string[];
  /** Dragged screen position of the launcher icon; `null` = use its default corner. */
  position: ChatLauncherPosition | null;
}

const DEFAULT_STATE: PersistedChatState = {
  sessionId: "",
  open: false,
  unreadCount: 0,
  dismissedGreetings: [],
  position: null,
};

function storageKey(variant: ChatVariant): string {
  return `chat:${variant}:state`;
}

// The backend keys conversation history by this id, so it must be unguessable — a random
// UUID where available (all modern browsers), Math.random only as a last-resort fallback.
function generateSessionId(): string {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  return `sess_${random}`;
}

function readState(variant: ChatVariant): PersistedChatState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE, sessionId: generateSessionId() };

  try {
    const raw = window.localStorage.getItem(storageKey(variant));
    if (!raw) throw new Error("no state");
    const parsed = JSON.parse(raw) as Partial<PersistedChatState>;
    return {
      sessionId: parsed.sessionId || generateSessionId(),
      open: parsed.open ?? false,
      unreadCount: parsed.unreadCount ?? 0,
      dismissedGreetings: parsed.dismissedGreetings ?? [],
      position: parsed.position ?? null,
    };
  } catch {
    return { ...DEFAULT_STATE, sessionId: generateSessionId() };
  }
}

function writeState(variant: ChatVariant, state: PersistedChatState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(variant), JSON.stringify(state));
  } catch {
    // Storage unavailable (private browsing, quota) — degrade to in-memory only.
  }
}

/**
 * localStorage-backed session id + open/unread state, namespaced per widget variant
 * (`chat:public:*` vs `chat:admin:*`) so the two widgets never collide.
 */
export function useChatPersistence(variant: ChatVariant) {
  const [state, setState] = useState<PersistedChatState>(() => readState(variant));

  const update = useCallback(
    (patch: Partial<PersistedChatState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        writeState(variant, next);
        return next;
      });
    },
    [variant]
  );

  const dismissGreeting = useCallback(
    (greetingId: string) => {
      setState((prev) => {
        if (prev.dismissedGreetings.includes(greetingId)) return prev;
        const next = { ...prev, dismissedGreetings: [...prev.dismissedGreetings, greetingId] };
        writeState(variant, next);
        return next;
      });
    },
    [variant]
  );

  return {
    sessionId: state.sessionId,
    open: state.open,
    unreadCount: state.unreadCount,
    dismissedGreetings: state.dismissedGreetings,
    position: state.position,
    setOpen: (open: boolean) => update({ open }),
    setUnreadCount: (unreadCount: number) => update({ unreadCount }),
    setPosition: (position: ChatLauncherPosition) => update({ position }),
    dismissGreeting,
  };
}
