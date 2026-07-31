/**
 * PRISMA ON CLOUDFLARE WORKERS:
 * This route persists data via Prisma + `pg` (see @/lib/prisma).
 * OpenNext runs on Workers with `nodejs_compat` (not Next.js Edge runtime).
 * If DB calls fail in production, use one of:
 * - Prisma Accelerate: https://www.prisma.io/data-platform/accelerate
 * - Or replace writes with Supabase JS client against the same Postgres tables.
 * Do not add `export const runtime = "edge"` here — unsupported by @opennextjs/cloudflare.
 */
import { NextRequest } from "next/server";
import { jsx } from "react/jsx-runtime";
import RequirementNotification from "@/emails/RequirementNotification";
import { createRequirementSubmission } from "@/services/requirementService";
import { requirementSubmissionSchema } from "@/lib/validators/requirement";
import {
  asOptionalHeader,
  formatZodFieldErrors,
} from "@/lib/validators/http";
import { apiError, apiSuccess, logApiError, mapApiError } from "@/lib/apiResponses";
import {
  getEmailAddresses,
  isEmailConfigured,
  sendReactEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    let data: unknown;
    try {
      data = await request.json();
    } catch {
      return apiError(400, "Validation failed", {
        fieldErrors: { body: ["Request body must be valid JSON"] },
      });
    }

    const parsed = requirementSubmissionSchema.safeParse(data);
    if (!parsed.success) {
      return apiError(400, "Validation failed", {
        fieldErrors: formatZodFieldErrors(parsed.error),
      });
    }

    const body = parsed.data;
    const source = body.source ?? null;
    const referrer =
      body.referrer ?? asOptionalHeader(request.headers.get("referer"));
    const userAgent =
      body.userAgent ?? asOptionalHeader(request.headers.get("user-agent"));
    const ip =
      body.ip ??
      asOptionalHeader(request.headers.get("x-forwarded-for"))?.split(",")[0]?.trim() ??
      null;

    const metaBase: Record<string, unknown> =
      body.metadata &&
      typeof body.metadata === "object" &&
      !Array.isArray(body.metadata)
        ? { ...(body.metadata as Record<string, unknown>) }
        : {};
    if (body.questionnaire) {
      metaBase.questionnaire = body.questionnaire;
      metaBase.questionnaireVersion = 1;
    }
    const phone = body.phone?.trim();
    if (phone) metaBase.phone = phone;
    const companyLocation = body.companyLocation?.trim();
    if (companyLocation) metaBase.companyLocation = companyLocation;

    /** Deep-clone so stored JSON only gets plain values (no undefined / non-JSON types). */
    const metadata: Record<string, unknown> | null =
      Object.keys(metaBase).length > 0
        ? (JSON.parse(JSON.stringify(metaBase)) as Record<string, unknown>)
        : null;

    try {
      const created = await createRequirementSubmission({
        intent: body.intent,
        name: body.name,
        email: body.email,
        message: body.message,
        company: body.company ?? null,
        website: body.website ?? null,
        role: body.role ?? null,
        projectType: body.projectType ?? null,
        industry: body.industry ?? null,
        companySize: body.companySize ?? null,
        goals: body.goals ?? null,
        budgetRange: body.budgetRange ?? null,
        startDate: body.startDate ?? null,
        launchWindow: body.launchWindow ?? null,
        urgency: body.urgency ?? null,
        timeline: body.timeline ?? null,
        preferredTime: body.preferredTime ?? null,
        timezone: body.timezone ?? null,
        channel: body.channel ?? null,
        features: body.features ?? null,
        integrations: body.integrations ?? null,
        successCriteria: body.successCriteria ?? null,
        source,
        referrer,
        userAgent,
        ip,
        metadata,
      });

      // DB write is source of truth; email failures are logged only.
      if (isEmailConfigured()) {
        const addresses = getEmailAddresses();
        if (!addresses) {
          console.warn(
            "[/api/requirements] EMAIL_FROM set but EMAIL_ADMIN_TO missing; skipping emails"
          );
        } else {
          const { from, adminTo } = addresses;
          try {
            await sendReactEmail({
              from,
              to: adminTo,
              subject: `New requirements: ${body.name} (${body.intent})`,
              react: jsx(RequirementNotification, {
                intent: body.intent,
                name: body.name,
                email: body.email,
                message: body.message,
                submissionId: created.id,
                phone: body.phone ?? null,
                company: body.company ?? null,
                companyLocation: body.companyLocation ?? null,
                website: body.website ?? null,
                role: body.role ?? null,
                projectType: body.projectType ?? null,
                industry: body.industry ?? null,
                companySize: body.companySize ?? null,
                goals: body.goals ?? null,
                budgetRange: body.budgetRange ?? null,
                startDate: body.startDate ?? null,
                launchWindow: body.launchWindow ?? null,
                urgency: body.urgency ?? null,
                timeline: body.timeline ?? null,
                preferredTime: body.preferredTime ?? null,
                timezone: body.timezone ?? null,
                channel: body.channel ?? null,
                features: body.features ?? null,
                integrations: body.integrations ?? null,
                successCriteria: body.successCriteria ?? null,
                source,
                referrer,
                questionnaire: body.questionnaire,
              }),
            });
          } catch (error) {
            logApiError("/api/requirements/email-admin", error);
          }
        }
      }

      return apiSuccess({ id: created.id }, 201);
    } catch (error) {
      logApiError("/api/requirements", error);
      const mapped = mapApiError(error);
      return apiError(mapped.status, mapped.error, mapped.details);
    }
  } catch (error) {
    logApiError("/api/requirements", error);
    return apiError(500, "Internal server error");
  }
}
