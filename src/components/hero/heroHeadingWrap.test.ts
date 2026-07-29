import { describe, expect, it } from "vitest";
import {
  NOWRAP_MAX_CHARS,
  STACK_MIN_TOTAL_CHARS,
  phraseGroupClass,
  shouldStackOnDesktop,
} from "@/components/hero/heroHeadingWrap";

describe("shouldStackOnDesktop", () => {
  it("skips stacking when combined copy is short", () => {
    expect(shouldStackOnDesktop("Hi", "there")).toBe(false);
    expect("Hi".length + "there".length + 1).toBeLessThanOrEqual(STACK_MIN_TOTAL_CHARS);
  });

  it("stacks for default and CMS two-phrase homepage copy", () => {
    expect(shouldStackOnDesktop("Architecting", "Digital Futures")).toBe(true);
    expect(shouldStackOnDesktop("Custom Software", "Built to Scale")).toBe(true);
  });
});

describe("phraseGroupClass", () => {
  it("adds nowrap when the phrase fits NOWRAP_MAX_CHARS", () => {
    const short = "a".repeat(NOWRAP_MAX_CHARS);
    expect(phraseGroupClass(short, false)).toContain("whitespace-nowrap");
  });

  it("omits nowrap when the phrase is longer than NOWRAP_MAX_CHARS", () => {
    const long = "a".repeat(NOWRAP_MAX_CHARS + 1);
    expect(phraseGroupClass(long, false)).not.toContain("whitespace-nowrap");
  });

  it("adds block stack class when stackOnDesktop is true", () => {
    expect(phraseGroupClass("Custom Software", true)).toContain("block");
    expect(phraseGroupClass("Built to Scale", true)).toContain("whitespace-nowrap");
  });

  it("omits block stack class when stackOnDesktop is false", () => {
    expect(phraseGroupClass("Hi", false)).not.toMatch(/(?:^|\s)block(?:\s|$)/);
  });
});
