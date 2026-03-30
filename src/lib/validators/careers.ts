import { z } from "zod";
import {
  metadataSchema,
  optionalTrimmedString,
  requiredTrimmedString,
} from "@/lib/validators/shared";

const optionalUrl = optionalTrimmedString.pipe(
  z.string().url("Must be a valid URL").optional()
);

export const careerApplicationSubmissionSchema = z.object({
  name: requiredTrimmedString("Name is required"),
  email: requiredTrimmedString("Email is required").pipe(
    z.string().email("Email must be a valid email address")
  ),
  roleInterest: optionalTrimmedString,
  message: requiredTrimmedString("Message is required"),
  portfolioUrl: optionalUrl,
  linkedInUrl: optionalUrl,
  githubUrl: optionalUrl,
  source: optionalTrimmedString,
  referrer: optionalTrimmedString,
  userAgent: optionalTrimmedString,
  ip: optionalTrimmedString,
  metadata: metadataSchema,
});

export type CareerApplicationSubmissionInput = z.infer<
  typeof careerApplicationSubmissionSchema
>;

