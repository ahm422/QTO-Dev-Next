import { describe, expect, it } from "vitest";
import { CNIC_REGEX, employeeSchema } from "@/lib/validators/employees/employee";

function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    employeeCode: "QTO-001",
    name: "Jane Doe",
    cnic: "12345-1234567-1",
    ...overrides,
  };
}

describe("CNIC_REGEX", () => {
  it("accepts the canonical dashed format", () => {
    expect(CNIC_REGEX.test("12345-1234567-1")).toBe(true);
  });

  it("rejects undashed digits", () => {
    expect(CNIC_REGEX.test("1234512345671")).toBe(false);
  });

  it("rejects wrong group lengths", () => {
    expect(CNIC_REGEX.test("1234-1234567-1")).toBe(false);
    expect(CNIC_REGEX.test("12345-123456-1")).toBe(false);
    expect(CNIC_REGEX.test("12345-1234567-12")).toBe(false);
  });
});

describe("employeeSchema", () => {
  it("accepts a minimal valid employee", () => {
    const result = employeeSchema.safeParse(baseInput());
    expect(result.success).toBe(true);
  });

  it("rejects a malformed CNIC", () => {
    const result = employeeSchema.safeParse(baseInput({ cnic: "not-a-cnic" }));
    expect(result.success).toBe(false);
  });

  it("rejects a future date of birth", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const result = employeeSchema.safeParse(baseInput({ dob: future.toISOString() }));
    expect(result.success).toBe(false);
  });

  it("accepts a past date of birth", () => {
    const result = employeeSchema.safeParse(baseInput({ dob: "1990-01-01" }));
    expect(result.success).toBe(true);
  });

  it("rejects cnicExpiryDate before cnicIssueDate", () => {
    const result = employeeSchema.safeParse(
      baseInput({ cnicIssueDate: "2020-01-01", cnicExpiryDate: "2019-01-01" }),
    );
    expect(result.success).toBe(false);
  });

  it("accepts cnicExpiryDate on or after cnicIssueDate", () => {
    const result = employeeSchema.safeParse(
      baseInput({ cnicIssueDate: "2020-01-01", cnicExpiryDate: "2020-01-01" }),
    );
    expect(result.success).toBe(true);
  });

  it("defaults status to active", () => {
    const result = employeeSchema.parse(baseInput());
    expect(result.status).toBe("active");
  });
});
