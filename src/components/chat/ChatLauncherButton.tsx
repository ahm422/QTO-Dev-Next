"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, type PanInfo } from "framer-motion";
import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ChatLauncherPosition } from "@/hooks/useChatPersistence";
import { BUTTON_SIZE, EDGE_MARGIN, clampToViewport, resolveLauncherPosition } from "@/components/chat/launcherPosition";

const DRAG_THRESHOLD = 4; // px of movement before a gesture counts as a drag, not a click

interface ChatLauncherButtonProps {
  open: boolean;
  onClick: () => void;
  unreadCount?: number;
  label: string;
  greeting?: string;
  showGreeting?: boolean;
  onDismissGreeting?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  /** Dragged screen position, persisted by the caller; `null` uses `defaultCorner`. */
  position: ChatLauncherPosition | null;
  onPositionChange: (position: ChatLauncherPosition) => void;
  /** Where the icon starts before it's ever been dragged. */
  defaultCorner: "bottom-right" | "bottom-left";
  /** For `"bottom-left"` only: extra left inset (px) applied at the `lg` breakpoint and up — e.g. to clear a fixed sidebar. */
  leftInsetAtLg?: number;
}

/**
 * Freely draggable 56px circular launcher — icon swap, unread badge, dismissible hover
 * greeting bubble. Self-positions via `fixed` + framer-motion, independent of any parent's
 * layout (the panel keeps its own separate fixed-corner anchor; only the closed icon moves).
 */
export const ChatLauncherButton = forwardRef<HTMLButtonElement, ChatLauncherButtonProps>(
  function ChatLauncherButton(
    {
      open,
      onClick,
      unreadCount = 0,
      label,
      greeting,
      showGreeting,
      onDismissGreeting,
      onMouseEnter,
      onMouseLeave,
      className,
      position,
      onPositionChange,
      defaultCorner,
      leftInsetAtLg = 0,
    },
    ref
  ) {
    const reduceMotion = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [ready, setReady] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const draggedRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    // Resolve (and re-clamp) the on-screen position on mount and whenever the viewport resizes,
    // so the icon never ends up stranded off-screen (e.g. after rotating a phone).
    useEffect(() => {
      const resolve = () => {
        const next = resolveLauncherPosition(position, defaultCorner, leftInsetAtLg);
        x.set(next.x);
        y.set(next.y);
        setReady(true);
      };
      resolve();
      window.addEventListener("resize", resolve);
      return () => window.removeEventListener("resize", resolve);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- re-resolve only when the persisted position/corner/inset actually change
    }, [position, defaultCorner, leftInsetAtLg]);

    const handleDragStart = useCallback((_: unknown, info: PanInfo) => {
      draggedRef.current = false;
      dragStartRef.current = { x: info.point.x, y: info.point.y };
      setIsDragging(true);
    }, []);

    const handleDrag = useCallback((_: unknown, info: PanInfo) => {
      const dx = info.point.x - dragStartRef.current.x;
      const dy = info.point.y - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) draggedRef.current = true;
    }, []);

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
      const next = clampToViewport({ x: x.get(), y: y.get() });
      x.set(next.x);
      y.set(next.y);
      onPositionChange(next);
    }, [onPositionChange, x, y]);

    const handleClick = useCallback(() => {
      // A real drag shouldn't also toggle the panel — only a genuine tap/click does.
      if (draggedRef.current) {
        draggedRef.current = false;
        return;
      }
      onClick();
    }, [onClick]);

    const dragConstraints =
      typeof window !== "undefined"
        ? {
            left: EDGE_MARGIN,
            top: EDGE_MARGIN,
            right: Math.max(EDGE_MARGIN, window.innerWidth - EDGE_MARGIN - BUTTON_SIZE),
            bottom: Math.max(EDGE_MARGIN, window.innerHeight - EDGE_MARGIN - BUTTON_SIZE),
          }
        : undefined;

    return (
      <motion.div
        className="fixed z-40"
        style={{ x, y, visibility: ready ? "visible" : "hidden" }}
        drag
        dragMomentum={false}
        dragElastic={reduceMotion ? 0 : 0.08}
        dragConstraints={dragConstraints}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={reduceMotion ? undefined : { scale: 1.08 }}
      >
        <div className="relative flex items-center">
          {greeting && showGreeting && !open && !isDragging && (
            <div
              role="status"
              className={cn(
                "absolute right-full mr-4 flex w-64 items-start gap-2.5 rounded-2xl border border-border/60",
                "bg-surface/95 px-3.5 py-3 shadow-xl shadow-black/10 ring-1 ring-black/[0.03] backdrop-blur-sm dark:ring-white/[0.04]",
                !reduceMotion && "animate-in fade-in slide-in-from-right-2 duration-300"
              )}
            >
              {/* Speech-bubble tail pointing at the launcher */}
              <span
                aria-hidden="true"
                className="absolute -right-[7px] bottom-4 size-3 rotate-45 border-r border-b border-border/60 bg-surface"
              />

              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600">
                <AppIcon name="comment-dots" size="sm" className="!text-sm text-white" />
              </div>

              <p className="flex-1 pt-0.5 text-sm leading-snug font-medium text-foreground">{greeting}</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismissGreeting?.();
                }}
                aria-label="Dismiss"
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <AppIcon name="xmark" size="sm" className="!text-xs" />
              </button>
            </div>
          )}

          <button
            ref={ref}
            type="button"
            onClick={handleClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            aria-label={label}
            aria-expanded={open}
            className={cn(
              "relative flex size-14 items-center justify-center rounded-full",
              "bg-gradient-to-br from-primary via-primary to-orange-600 text-white shadow-lg shadow-primary/30",
              "cursor-grab touch-none select-none active:cursor-grabbing",
              "transition hover:scale-105 hover:shadow-xl hover:shadow-primary/40 motion-reduce:transition-none motion-reduce:hover:scale-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              className
            )}
          >
            {!open && !isDragging && (
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40 motion-reduce:hidden"
                style={{ animationDuration: "2.5s" }}
              />
            )}

            <AppIcon name={open ? "xmark" : "comment-dots"} size="lg" className="text-white" />

            {!open && unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white ring-2 ring-background"
                aria-label={`${unreadCount} unread messages`}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>
    );
  }
);
