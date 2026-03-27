import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createRequirementSubmission } from "@/services/requirementService";
import { requirementSubmissionSchema } from "@/lib/validators/requirement";
import {
  asOptionalHeader,
  formatZodFieldErrors,
} from "@/lib/validators/http";

export async function POST(request: NextRequest) {
  try {
    let data: unknown;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: { body: ["Request body must be valid JSON"] } },
        { status: 400 }
      );
    }

    const parsed = requirementSubmissionSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fieldErrors: formatZodFieldErrors(parsed.error),
        },
        { status: 400 }
      );
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

    return NextResponse.json(
      { success: true, id: created.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Requirement form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
