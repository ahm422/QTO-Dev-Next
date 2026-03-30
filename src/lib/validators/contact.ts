import { z } from "zod";
import {
  metadataSchema,
  optionalTrimmedString,
  requiredTrimmedString,
} from "@/lib/validators/shared";

export const contactSubmissionSchema = z
  .object({
    name: requiredTrimmedString("Name is required"),
    email: requiredTrimmedString("Email is required").pipe(
      z.string().email("Email must be a valid email address")
    ),
    subject: optionalTrimmedString.default("General Inquiry"),
    message: requiredTrimmedString("Message is required"),
    source: optionalTrimmedString,
    referrer: optionalTrimmedString,
    userAgent: optionalTrimmedString,
    ip: optionalTrimmedString,
    metadata: metadataSchema,
  });

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
