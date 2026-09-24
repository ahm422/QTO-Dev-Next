/**
 * Smooths a streamed reply into a steady typing effect. The LLM often produces a whole answer in
 * about a second and the network delivers tokens in bursts, so appending each chunk as it arrives
 * makes the reply appear all at once. Instead, pushed text is buffered and revealed a few
 * characters per tick. The pace scales with the backlog, so the display never falls far behind
 * the model: short backlogs type at ~120 chars/s, large ones catch up within a couple of seconds.
 */

const TICK_MS = 16;
const MIN_CHARS_PER_TICK = 2;
/** Reveal 1/N of the current backlog per tick — larger N = smoother but slower catch-up. */
const BACKLOG_DIVISOR = 40;

export interface Typewriter {
  /** Queue text to be revealed. */
  push(text: string): void;
  /** Resolves once everything pushed so far has been revealed. */
  drain(): Promise<void>;
  /** Stop immediately and drop anything not yet revealed. */
  cancel(): void;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function createTypewriter(onReveal: (text: string) => void): Typewriter {
  const instant = prefersReducedMotion();
  let buffer = "";
  let timer: ReturnType<typeof setInterval> | null = null;
  let waiters: Array<() => void> = [];

  const stop = () => {
    if (timer !== null) clearInterval(timer);
    timer = null;
  };

  const settle = () => {
    const pending = waiters;
    waiters = [];
    pending.forEach((resolve) => resolve());
  };

  const tick = () => {
    if (!buffer) {
      stop();
      settle();
      return;
    }
    let n = Math.max(MIN_CHARS_PER_TICK, Math.ceil(buffer.length / BACKLOG_DIVISOR));
    // Don't split a surrogate pair (emoji), or a half-character flashes on screen.
    const code = buffer.charCodeAt(n - 1);
    if (code >= 0xd800 && code <= 0xdbff) n++;
    const out = buffer.slice(0, n);
    buffer = buffer.slice(n);
    onReveal(out);
  };

  return {
    push(text) {
      if (!text) return;
      if (instant) {
        onReveal(text);
        return;
      }
      buffer += text;
      if (timer === null) timer = setInterval(tick, TICK_MS);
    },
    drain() {
      if (!buffer && timer === null) return Promise.resolve();
      return new Promise<void>((resolve) => waiters.push(resolve));
    },
    cancel() {
      buffer = "";
      stop();
      settle();
    },
  };
}
