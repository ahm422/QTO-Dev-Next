import { describe, it, expect } from "vitest"
import { formatCnic } from "./formatCnic"
import { CNIC_REGEX } from "@/lib/validators/employees/employee"

describe("formatCnic", () => {
  it("inserts dashes as digits are typed", () => {
    expect(formatCnic("12345")).toBe("12345")
    expect(formatCnic("123451234567")).toBe("12345-1234567")
    expect(formatCnic("1234512345671")).toBe("12345-1234567-1")
  })

  it("normalises a spaced / mis-dashed value to canonical form", () => {
    const out = formatCnic("12345 1234567 1")
    expect(out).toBe("12345-1234567-1")
    expect(CNIC_REGEX.test(out)).toBe(true)
  })

  it("caps at 13 digits", () => {
    expect(formatCnic("123451234567199999")).toBe("12345-1234567-1")
  })

  it("leaves an already-canonical value unchanged", () => {
    expect(formatCnic("12345-1234567-1")).toBe("12345-1234567-1")
  })

  it("returns empty string for no digits", () => {
    expect(formatCnic("abc")).toBe("")
  })
})
