import { describe, expect, it } from "vitest";
import { BLOOD_GROUPS, CNIC_REGEX, employeeSchema } from "@/lib/validators/employees/employee";

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

  it("treats empty-string date inputs as null (optional dates)", () => {
    const r = employeeSchema.safeParse(
      baseInput({ dob: "", joiningDate: "", cnicIssueDate: "", cnicExpiryDate: "" }),
    );
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.dob).toBeNull();
      expect(r.data.joiningDate).toBeNull();
      expect(r.data.cnicIssueDate).toBeNull();
      expect(r.data.cnicExpiryDate).toBeNull();
    }
  });

  it("still parses real date strings to Date", () => {
    const r = employeeSchema.safeParse(baseInput({ joiningDate: "2024-01-15" }));
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.joiningDate).toBeInstanceOf(Date);
  });

  it("still enforces cross-field date rules when both dates are set", () => {
    const r = employeeSchema.safeParse(
      baseInput({ cnicIssueDate: "2020-01-01", cnicExpiryDate: "2019-01-01" }),
    );
    expect(r.success).toBe(false);
  });

  it("accepts a partial form where dates were typed then cleared", () => {
    const r = employeeSchema.safeParse(baseInput({ dob: "", cnicExpiryDate: "" }));
    expect(r.success).toBe(true);
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

  it("accepts every valid blood group", () => {
    for (const group of BLOOD_GROUPS) {
      expect(employeeSchema.safeParse(baseInput({ bloodGroup: group })).success).toBe(true);
    }
  });

  it("accepts an empty blood group", () => {
    expect(employeeSchema.safeParse(baseInput({ bloodGroup: "" })).success).toBe(true);
  });

  it("rejects an invalid blood group", () => {
    expect(employeeSchema.safeParse(baseInput({ bloodGroup: "XYZ" })).success).toBe(false);
    expect(employeeSchema.safeParse(baseInput({ bloodGroup: "a+" })).success).toBe(false);
  });
});
