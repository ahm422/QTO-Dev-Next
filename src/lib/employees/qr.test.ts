import { describe, it, expect, vi, afterEach } from "vitest"

async function loadBuilder() {
  vi.resetModules()
  const mod = await import("./qr")
  return mod.buildEmployeeCardUrl
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("buildEmployeeCardUrl", () => {
  it("uses the qtodev.com fallback when NEXT_PUBLIC_SITE_URL is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
    const build = await loadBuilder()
    expect(build("abc123")).toBe("https://qtodev.com/employee/abc123")
  })

  it("uses the configured site URL and trims a trailing slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.example.com/")
    const build = await loadBuilder()
    expect(build("abc123")).toBe("https://staging.example.com/employee/abc123")
  })

  it("never emits localhost in production — throws instead", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000")
    const build = await loadBuilder()
    expect(() => build("abc123")).toThrow(/loopback/i)
  })

  it("allows localhost outside production (local dev)", async () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000")
    const build = await loadBuilder()
    expect(build("abc123")).toBe("http://localhost:3000/employee/abc123")
  })
})
