import { z } from "zod";
import {
  metadataSchema,
  optionalTrimmedString,
  requiredTrimmedString,
} from "@/lib/validators/shared";

export const requirementSubmissionSchema = z
  .object({
    intent: requiredTrimmedString("Intent is required"),
    name: requiredTrimmedString("Name is required"),
    email: requiredTrimmedString("Email is required").pipe(
      z.string().email("Email must be a valid email address")
    ),
    message: requiredTrimmedString("Message is required"),
    company: optionalTrimmedString,
    website: optionalTrimmedString,
    role: optionalTrimmedString,
    projectType: optionalTrimmedString,
    industry: optionalTrimmedString,
    companySize: optionalTrimmedString,
    goals: optionalTrimmedString,
    budgetRange: optionalTrimmedString,
    startDate: optionalTrimmedString,
    launchWindow: optionalTrimmedString,
    urgency: optionalTrimmedString,
    timeline: optionalTrimmedString,
    preferredTime: optionalTrimmedString,
    timezone: optionalTrimmedString,
    channel: optionalTrimmedString,
    features: optionalTrimmedString,
    integrations: optionalTrimmedString,
    successCriteria: optionalTrimmedString,
    source: optionalTrimmedString,
    referrer: optionalTrimmedString,
    userAgent: optionalTrimmedString,
    ip: optionalTrimmedString,
    metadata: metadataSchema,
  })
  .passthrough();

export type RequirementSubmissionInput = z.infer<
  typeof requirementSubmissionSchema
>;
