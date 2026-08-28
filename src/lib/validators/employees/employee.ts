import { z } from "zod";

// Pakistani CNIC, canonical dashed form: 12345-1234567-1. Phase 06's bulk
// import normalizer strips any other formatting down to this shape before
// validating through this same schema — see src/lib/employees/import (Phase 06).
export const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

export const EMPLOYEE_STATUSES = ["active", "inactive", "terminated"] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() > today.getTime();
}

// Base (unrefined) schema — exported separately so PATCH routes can call
// `.partial()` on it (Zod v4 forbids `.partial()` on a schema that already
// carries a `.superRefine`), matching the teamMemberSchema convention.
export const employeeBaseSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required"),
  name: z.string().min(1, "Name is required"),
  designation: z.string().optional().default(""),
  department: z.string().optional().default(""),
  team: z.string().optional().default(""),
  status: z.enum(EMPLOYEE_STATUSES).default("active"),
  email: z
    .union([z.string().email("Invalid email"), z.literal("")])
    .optional()
    .default(""),
  phone: z.string().optional().default(""),
  cnic: z.string().regex(CNIC_REGEX, "CNIC must be in the format 12345-1234567-1"),
  cnicIssueDate: z.coerce.date().optional().nullable(),
  cnicExpiryDate: z.coerce.date().optional().nullable(),
  dob: z.coerce.date().optional().nullable(),
  bloodGroup: z
    .union([z.enum(BLOOD_GROUPS), z.literal("")])
    .optional()
    .nullable()
    .default(""),
  officeAddress: z.string().optional().default(""),
  emergencyContactName: z.string().optional().default(""),
  emergencyContactPhone: z.string().optional().default(""),
  emergencyContactRelation: z.string().optional().default(""),
  photoKey: z.string().optional().nullable(),
  joiningDate: z.coerce.date().optional().nullable(),
});

export const employeeSchema = employeeBaseSchema.superRefine((data, ctx) => {
  if (data.dob && isFutureDate(data.dob)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Date of birth cannot be in the future",
      path: ["dob"],
    });
  }
  if (data.cnicIssueDate && data.cnicExpiryDate && data.cnicExpiryDate < data.cnicIssueDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CNIC expiry date must be on or after the issue date",
      path: ["cnicExpiryDate"],
    });
  }
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
