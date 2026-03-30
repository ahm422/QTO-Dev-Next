import { z } from "zod";
import { optionalTrimmedString } from "@/lib/validators/shared";

export const QTODEV_CLIENT_QUESTIONNAIRE_INTENT = "qtodev-client-questionnaire";

const yesNo = z.enum(["yes", "no"], {
  message: "Please choose Yes or No",
});

export const serviceOptionSchema = z.enum([
  "website-design-development",
  "logo-design",
  "full-branding-kit",
  "ui-ux-design",
  "seo-digital-marketing",
  "custom-portal-dashboard",
  "other",
]);

export const pageOptionSchema = z.enum([
  "home",
  "about",
  "services",
  "projects",
  "portfolios",
  "testimonials",
  "contact",
  "careers",
  "faq",
  "blogs",
  "other",
]);

export const brandingMaterialSchema = z.enum([
  "business-card",
  "letterhead",
  "social-kit",
  "brand-guidelines",
]);

export const clientQuestionnaireSchema = z
  .object({
    servicesInterested: z
      .array(serviceOptionSchema)
      .min(1, "Select at least one service"),
    servicesOtherSpecify: optionalTrimmedString,
    existingWebsite: yesNo,
    existingWebsiteLink: optionalTrimmedString,
    hasDomainHosting: yesNo,
    pagesWanted: z
      .array(pageOptionSchema)
      .min(1, "Select at least one page for your site"),
    pagesOther: optionalTrimmedString,
    contentReady: z.enum(["yes", "no", "need-help"], {
      message: "Select whether content is ready or if you need help",
    }),
    referenceWebsites: optionalTrimmedString,
    hasLogo: yesNo,
    logoRedesign: yesNo.optional(),
    logoStylePreferred: optionalTrimmedString,
    brandColours: optionalTrimmedString,
    brandingMaterials: z.array(brandingMaterialSchema).default([]),
    companyDescription: optionalTrimmedString,
    tradesScopes: optionalTrimmedString,
    projectKinds: optionalTrimmedString,
    differentiators: optionalTrimmedString,
    attachmentFileNames: z.array(z.string()).max(20).optional(),
    platformApproachAcknowledged: z.boolean().optional(),
  })
  .superRefine((q, ctx) => {
    if (
      q.servicesInterested.includes("other") &&
      !q.servicesOtherSpecify?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe the other services",
        path: ["servicesOtherSpecify"],
      });
    }
    if (q.existingWebsite === "yes" && !q.existingWebsiteLink?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please share a link to your existing website",
        path: ["existingWebsiteLink"],
      });
    }
    if (q.hasLogo === "yes" && q.logoRedesign === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please choose whether you want a redesign or enhancement",
        path: ["logoRedesign"],
      });
    }
    if (!q.companyDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Briefly describe your company",
        path: ["companyDescription"],
      });
    }
    if (q.pagesWanted.includes("other") && !q.pagesOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe the other pages you need",
        path: ["pagesOther"],
      });
    }
  });

export type ClientQuestionnairePayload = z.infer<
  typeof clientQuestionnaireSchema
>;
