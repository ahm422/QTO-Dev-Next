import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots()", () => {
  it("disallows only /admin and /api (never /_next)", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    // Order-sensitive exact allowlist — re-adding /_next (or other broad paths) must fail CI.
    expect(rules?.disallow).toEqual(["/admin", "/api"]);
    expect(rules?.disallow).not.toContain("/_next");
    expect(rules?.allow).toEqual(["/"]);
    expect(rules?.userAgent).toBe("*");
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
