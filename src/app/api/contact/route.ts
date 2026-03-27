import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createContactSubmission } from "@/services/contactService";

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
    const name = asNonEmptyString(body.name);
    const email = asNonEmptyString(body.email);
    const message = asNonEmptyString(body.message);
    const subject = asOptionalString(body.subject) ?? "General Inquiry";

    if (!name || !email || !message) {
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

    const created = await createContactSubmission({
      name,
      email,
      subject,
      message,
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
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
