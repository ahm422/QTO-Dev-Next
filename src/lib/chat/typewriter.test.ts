import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTypewriter } from "./typewriter";

describe("createTypewriter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("reveals a burst gradually instead of all at once", () => {
    let shown = "";
    const tw = createTypewriter((t) => (shown += t));
    const text = "QTO Dev builds web and mobile apps for businesses.";

    tw.push(text);
    expect(shown).toBe("");

    vi.advanceTimersByTime(16);
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.length).toBeLessThan(text.length);

    vi.advanceTimersByTime(5_000);
    expect(shown).toBe(text);
  });

  it("drain resolves only after everything pushed has been revealed", async () => {
    let shown = "";
    const tw = createTypewriter((t) => (shown += t));
    tw.push("Hello ");
    tw.push("there!");

    let drained = false;
    void tw.drain().then(() => (drained = true));
    await vi.advanceTimersByTimeAsync(5_000);

    expect(drained).toBe(true);
    expect(shown).toBe("Hello there!");
  });

  it("catches up on a large backlog within a couple of seconds", () => {
    let shown = "";
    const tw = createTypewriter((t) => (shown += t));
    const text = "x".repeat(1500);
    tw.push(text);
    vi.advanceTimersByTime(3_000);
    expect(shown).toBe(text);
  });

  it("never splits an emoji surrogate pair", () => {
    const pieces: string[] = [];
    const tw = createTypewriter((t) => pieces.push(t));
    tw.push("a😀b😀c😀");
    vi.advanceTimersByTime(1_000);
    for (const p of pieces) {
      expect(p.charCodeAt(p.length - 1)).not.toSatisfy((c: number) => c >= 0xd800 && c <= 0xdbff);
    }
    expect(pieces.join("")).toBe("a😀b😀c😀");
  });

  it("cancel drops unrevealed text and settles pending drains", async () => {
    let shown = "";
    const tw = createTypewriter((t) => (shown += t));
    tw.push("x".repeat(500));
    const drained = tw.drain();
    tw.cancel();
    await expect(drained).resolves.toBeUndefined();
    const lengthAtCancel = shown.length;
    vi.advanceTimersByTime(1_000);
    expect(shown.length).toBe(lengthAtCancel);
  });
});
