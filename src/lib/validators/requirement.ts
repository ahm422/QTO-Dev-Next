import { z } from "zod";
import {
  clientQuestionnaireSchema,
  QTODEV_CLIENT_QUESTIONNAIRE_INTENT,
} from "@/lib/validators/clientQuestionnaire";
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
    phone: optionalTrimmedString,
    company: optionalTrimmedString,
    companyLocation: optionalTrimmedString,
    website: optionalTrimmedString,
    role: optionalTrimmedString,
    questionnaire: clientQuestionnaireSchema.optional(),
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
  .passthrough()
  .superRefine((data, ctx) => {
    if (data.intent === QTODEV_CLIENT_QUESTIONNAIRE_INTENT) {
      if (!data.phone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required",
          path: ["phone"],
        });
      }
      if (!data.questionnaire) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Questionnaire responses are required",
          path: ["questionnaire"],
        });
      }
    }
  });

export type RequirementSubmissionInput = z.infer<
  typeof requirementSubmissionSchema
>;
