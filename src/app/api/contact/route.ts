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
import type { Prisma } from "@prisma/client";
import { createContactSubmission } from "@/services/contactService";
import { contactSubmissionSchema } from "@/lib/validators/contact";
import {
  asOptionalHeader,
  formatZodFieldErrors,
} from "@/lib/validators/http";
import { apiError, apiSuccess, logApiError, mapApiError } from "@/lib/apiResponses";

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

    const parsed = contactSubmissionSchema.safeParse(data);
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

    const metadata = (body.metadata as Prisma.InputJsonValue | undefined) ?? null;

    try {
      const created = await createContactSubmission({
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        source,
        referrer,
        userAgent,
        ip,
        metadata,
      });

      return apiSuccess({ id: created.id }, 201);
    } catch (error) {
      logApiError("/api/contact", error);
      const mapped = mapApiError(error);
      return apiError(mapped.status, mapped.error, mapped.details);
    }
  } catch (error) {
    logApiError("/api/contact", error);
    return apiError(500, "Internal server error");
  }
}
