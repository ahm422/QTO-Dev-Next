import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createRequirementSubmission } from "@/services/requirementService";

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest) {
  try {
    const data: unknown = await request.json();
    const body = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;

    // Interim minimal validation (Issue #8 will add strict schema validation)
    const intent = asNonEmptyString(body.intent);
    const name = asNonEmptyString(body.name);
    const email = asNonEmptyString(body.email);
    const message = asNonEmptyString(body.message);

    if (!intent || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const source = asOptionalString(body.source);
    const referrer =
      asOptionalString(body.referrer) ?? asOptionalString(request.headers.get("referer"));
    const userAgent =
      asOptionalString(body.userAgent) ?? asOptionalString(request.headers.get("user-agent"));
    const ip =
      asOptionalString(body.ip) ??
      asOptionalString(request.headers.get("x-forwarded-for"))?.split(",")[0]?.trim() ??
      null;

    const metadata =
      body.metadata && typeof body.metadata === "object"
        ? (body.metadata as Prisma.InputJsonValue)
        : null;

    const created = await createRequirementSubmission({
      intent,
      name,
      email,
      message,
      company: asOptionalString(body.company),
      website: asOptionalString(body.website),
      role: asOptionalString(body.role),
      projectType: asOptionalString(body.projectType),
      industry: asOptionalString(body.industry),
      companySize: asOptionalString(body.companySize),
      goals: asOptionalString(body.goals),
      budgetRange: asOptionalString(body.budgetRange),
      startDate: asOptionalString(body.startDate),
      launchWindow: asOptionalString(body.launchWindow),
      urgency: asOptionalString(body.urgency),
      timeline: asOptionalString(body.timeline),
      preferredTime: asOptionalString(body.preferredTime),
      timezone: asOptionalString(body.timezone),
      channel: asOptionalString(body.channel),
      features: asOptionalString(body.features),
      integrations: asOptionalString(body.integrations),
      successCriteria: asOptionalString(body.successCriteria),
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
