import { cn } from "@/components/theme/cn";

/**
 * Length-aware wrap control for the homepage hero (issues #376, #380).
 * Thresholds are estimated from the homepage type scale: ~26 bold chars fit
 * the full-width column at sm–md, and ~15 chars fit the narrow lg left column.
 */
/** Longest phrase that can be safely forced onto one line. */
export const NOWRAP_MAX_CHARS = 22;
/** Combined copy shorter than this fits one line — skip stacking. */
export const STACK_MIN_TOTAL_CHARS = 16;

export function shouldStackOnDesktop(a: string, b: string): boolean {
  return a.length + b.length + 1 > STACK_MIN_TOTAL_CHARS;
}

/**
 * Phrases short enough to fit a single line stay intact via nowrap.
 * When the combined title is long, each phrase becomes its own block so
 * wrap happens at the tone boundary (avoids mid-phrase side-by-side overflow
 * on sm–md, e.g. CMS "Custom Software" / "Built to Scale").
 * Short combined titles skip stacking and can share one line.
 */
export function phraseGroupClass(text: string, stackOnDesktop: boolean): string {
  return cn(
    text.length <= NOWRAP_MAX_CHARS && "whitespace-nowrap",
    stackOnDesktop && "block"
  );
}
