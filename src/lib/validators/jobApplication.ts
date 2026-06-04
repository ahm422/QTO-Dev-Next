import { z } from "zod"
import { optionalTrimmedString, requiredTrimmedString } from "@/lib/validators/shared"

export const jobApplicationSchema = z.object({
  jobId: requiredTrimmedString("Job ID is required").pipe(z.string().uuid("Invalid job ID")),
  jobTitle: requiredTrimmedString("Job title is required"),
  name: requiredTrimmedString("Full name is required"),
  email: requiredTrimmedString("Email is required").pipe(
    z.string().email("Please enter a valid email address")
  ),
  phone: optionalTrimmedString,
  coverLetter: z.string().max(2000, "Cover letter must be under 2000 characters").optional(),
  resumeUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  source: optionalTrimmedString,
  referrer: optionalTrimmedString,
  userAgent: optionalTrimmedString,
  ip: optionalTrimmedString,
})

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>
