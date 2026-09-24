"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isAsyncIterable, type ChatProvider } from "@/lib/chat/chatClient";
import { useChatPersistence, type ChatLauncherPosition } from "@/hooks/useChatPersistence";
import { createTypewriter } from "@/lib/chat/typewriter";
import type { ChatMessage, ChatVariant, QuickReply } from "@/types/chat";

function id(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

interface UseChatWidgetOptions {
  provider: ChatProvider;
  variant: ChatVariant;
  /** Set to false to skip loading the greeting automatically (e.g. behind a feature flag). */
  enabled?: boolean;
}

export interface UseChatWidgetResult {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  messages: ChatMessage[];
  quickReplies: QuickReply[];
  isTyping: boolean;
  /** Human-readable error message from the last failed send, if any. */
  error: string | null;
  /** True once the greeting has loaded and the widget is ready to send messages. */
  ready: boolean;
  unreadCount: number;
  greetingDismissed: boolean;
  dismissGreeting: () => void;
  /** Dragged screen position of the launcher icon; `null` = use its default corner. */
  position: ChatLauncherPosition | null;
  setPosition: (position: ChatLauncherPosition) => void;
  sendMessage: (text: string) => void;
  sendQuickReply: (reply: QuickReply) => void;
  retryLastMessage: () => void;
}

/**
 * Headless chat engine shared by the public and admin widgets. Pure state + effects —
 * no DOM/UI dependencies. Drives open/collapsed state, the message list, streaming
 * send/receive, quick replies, typing indicator, and error/retry.
 */
export function useChatWidget({ provider, variant, enabled = true }: UseChatWidgetOptions): UseChatWidgetResult {
  const persistence = useChatPersistence(variant);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const lastFailedTextRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load the greeting once, on first mount.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    provider
      .getGreeting()
      .then((greeting) => {
        if (cancelled) return;
        setMessages([greeting]);
        setQuickReplies(greeting.quickReplies ?? []);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Couldn't load the assistant right now. Please try again shortly.");
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- provider/variant are stable for the widget's lifetime
  }, [enabled]);

  // Cancel any in-flight request when the panel closes or the widget unmounts.
  useEffect(() => {
    if (!persistence.open) abortRef.current?.abort();
  }, [persistence.open]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Track unread count: bump it whenever an assistant message lands while collapsed.
  const bumpUnread = useCallback(() => {
    if (!persistence.open) persistence.setUnreadCount(persistence.unreadCount + 1);
  }, [persistence]);

  const runSend = useCallback(
    async (text: string) => {
      setError(null);
      lastFailedTextRef.current = null;

      const userMessage: ChatMessage = {
        id: id("msg"),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setQuickReplies([]);
      setIsTyping(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const result = provider.sendMessage(persistence.sessionId, text, controller.signal);

        if (isAsyncIterable(result)) {
          let assistantId: string | null = null;
          const updateAssistant = (update: (m: ChatMessage) => ChatMessage) =>
            setMessages((prev) => prev.map((m) => (m.id === assistantId ? update(m) : m)));

          // Chunks go through a typewriter rather than straight into the message, so the reply
          // visibly types out even when the model/network deliver it in one burst.
          const typewriter = createTypewriter((text) =>
            updateAssistant((m) => ({ ...m, content: m.content + text }))
          );
          controller.signal.addEventListener("abort", () => typewriter.cancel());

          for await (const chunk of result) {
            if (controller.signal.aborted) return;

            if (assistantId === null) {
              assistantId = chunk.messageId;
              setMessages((prev) => [
                ...prev,
                {
                  id: assistantId!,
                  role: "assistant",
                  content: "",
                  createdAt: new Date().toISOString(),
                  pending: true,
                },
              ]);
            }

            typewriter.push(chunk.delta);

            if (chunk.done) {
              // Finish typing before marking the message complete and showing quick replies.
              await typewriter.drain();
              if (controller.signal.aborted) return;
              updateAssistant((m) => ({
                ...m,
                pending: false,
                structuredData: chunk.structuredData,
                quickReplies: chunk.quickReplies,
              }));
              setQuickReplies(chunk.quickReplies ?? []);
              bumpUnread();
            }
          }
        } else {
          const message = await result;
          if (controller.signal.aborted) return;
          setMessages((prev) => [...prev, message]);
          setQuickReplies(message.quickReplies ?? []);
          bumpUnread();
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        lastFailedTextRef.current = text;
        setError(
          err instanceof Error ? `Message failed to send: ${err.message}` : "Message failed to send."
        );
      } finally {
        if (!controller.signal.aborted) setIsTyping(false);
      }
    },
    [provider, persistence, bumpUnread]
  );

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    void runSend(trimmed);
  }, [runSend]);

  const sendQuickReply = useCallback(
    (reply: QuickReply) => sendMessage(reply.value),
    [sendMessage]
  );

  const retryLastMessage = useCallback(() => {
    if (lastFailedTextRef.current) sendMessage(lastFailedTextRef.current);
  }, [sendMessage]);

  const setOpen = useCallback(
    (open: boolean) => {
      persistence.setOpen(open);
      if (open) persistence.setUnreadCount(0);
    },
    [persistence]
  );

  const toggleOpen = useCallback(() => setOpen(!persistence.open), [setOpen, persistence.open]);

  return {
    open: persistence.open,
    setOpen,
    toggleOpen,
    messages,
    quickReplies,
    isTyping,
    error,
    ready,
    unreadCount: persistence.unreadCount,
    greetingDismissed: persistence.dismissedGreetings.includes("hover-bubble"),
    dismissGreeting: () => persistence.dismissGreeting("hover-bubble"),
    position: persistence.position,
    setPosition: persistence.setPosition,
    sendMessage,
    sendQuickReply,
    retryLastMessage,
  };
}
