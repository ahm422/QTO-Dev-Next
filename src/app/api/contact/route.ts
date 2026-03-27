import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createContactSubmission } from "@/services/contactService";
import { contactSubmissionSchema } from "@/lib/validators/contact";
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

    const parsed = contactSubmissionSchema.safeParse(data);
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
