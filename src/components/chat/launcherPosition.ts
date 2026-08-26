import type { ChatLauncherPosition } from "@/hooks/useChatPersistence";

/**
 * Pure geometry shared by `ChatLauncherButton` (where the draggable icon sits) and the widgets
 * (where the panel should open next to it) — kept in one place so both agree on the same
 * numbers instead of drifting out of sync.
 */

export const BUTTON_SIZE = 56; // px — matches `size-14`
export const EDGE_MARGIN = 16; // px clear of viewport edges (and mobile browser chrome)
export const DEFAULT_BOTTOM_OFFSET = 96; // px from the bottom edge, roughly matching the old fixed anchor
export const LG_BREAKPOINT = 1024; // px — matches Tailwind's `lg:`

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function clampToViewport(pos: ChatLauncherPosition): ChatLauncherPosition {
  if (typeof window === "undefined") return pos;
  return {
    x: clamp(pos.x, EDGE_MARGIN, Math.max(EDGE_MARGIN, window.innerWidth - EDGE_MARGIN - BUTTON_SIZE)),
    y: clamp(pos.y, EDGE_MARGIN, Math.max(EDGE_MARGIN, window.innerHeight - EDGE_MARGIN - BUTTON_SIZE)),
  };
}

/** The icon's default corner position before it's ever been dragged. */
export function defaultLauncherPosition(
  corner: "bottom-right" | "bottom-left",
  leftInsetAtLg = 0
): ChatLauncherPosition {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const leftInset = corner === "bottom-left" && window.innerWidth >= LG_BREAKPOINT ? leftInsetAtLg : 0;
  return clampToViewport({
    x: corner === "bottom-right" ? window.innerWidth - EDGE_MARGIN - BUTTON_SIZE : EDGE_MARGIN + leftInset,
    y: window.innerHeight - DEFAULT_BOTTOM_OFFSET - BUTTON_SIZE,
  });
}

/** Where the icon actually is right now — persisted drag position, or its default corner. */
export function resolveLauncherPosition(
  position: ChatLauncherPosition | null,
  corner: "bottom-right" | "bottom-left",
  leftInsetAtLg = 0
): ChatLauncherPosition {
  return position ? clampToViewport(position) : defaultLauncherPosition(corner, leftInsetAtLg);
}

export interface PanelAnchor {
  top: number;
  left: number;
}

/**
 * Where the chat panel should open, anchored next to the icon's current position — flips
 * above/below and left/right of the icon to stay fully on-screen, then clamps as a last resort.
 */
export function computePanelAnchor(
  iconPos: ChatLauncherPosition,
  panelSize: { width: number; height: number },
  gap = 12
): PanelAnchor {
  if (typeof window === "undefined") return { top: EDGE_MARGIN, left: EDGE_MARGIN };

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const iconCenterX = iconPos.x + BUTTON_SIZE / 2;
  const iconCenterY = iconPos.y + BUTTON_SIZE / 2;

  const opensBelow = iconCenterY < viewportHeight / 2;
  const top = opensBelow ? iconPos.y + BUTTON_SIZE + gap : iconPos.y - gap - panelSize.height;

  const alignLeft = iconCenterX < viewportWidth / 2;
  const left = alignLeft ? iconPos.x : iconPos.x + BUTTON_SIZE - panelSize.width;

  return {
    top: clamp(top, EDGE_MARGIN, Math.max(EDGE_MARGIN, viewportHeight - EDGE_MARGIN - panelSize.height)),
    left: clamp(left, EDGE_MARGIN, Math.max(EDGE_MARGIN, viewportWidth - EDGE_MARGIN - panelSize.width)),
  };
}
