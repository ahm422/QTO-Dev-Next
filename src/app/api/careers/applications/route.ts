import { NextRequest } from "next/server"
import { jsx } from "react/jsx-runtime"
import type { Prisma } from "@prisma/client"
import JobApplicationEmail from "@/emails/JobApplicationEmail"
import { createJobApplication } from "@/services/jobApplicationService"
import { jobApplicationSchema } from "@/lib/validators/jobApplication"
import { asOptionalHeader, formatZodFieldErrors } from "@/lib/validators/http"
import { apiError, apiSuccess, logApiError, mapApiError } from "@/lib/apiResponses"
import { getResendAddresses, isResendConfigured, sendResendReactEmail } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    let data: unknown
    try {
      data = await request.json()
    } catch {
      return apiError(400, "Validation failed", {
        fieldErrors: { body: ["Request body must be valid JSON"] },
      })
    }

    const parsed = jobApplicationSchema.safeParse(data)
    if (!parsed.success) {
      return apiError(400, "Validation failed", {
        fieldErrors: formatZodFieldErrors(parsed.error),
      })
    }

    const body = parsed.data
    const referrer =
      body.referrer ?? asOptionalHeader(request.headers.get("referer"))
    const userAgent =
      body.userAgent ?? asOptionalHeader(request.headers.get("user-agent"))
    const ip =
      body.ip ??
      asOptionalHeader(request.headers.get("x-forwarded-for"))?.split(",")[0]?.trim() ??
      null

    try {
      const created = await createJobApplication({
        ...body,
        referrer,
        userAgent,
        ip,
        metadata: null as Prisma.InputJsonValue | null,
      })

      if (isResendConfigured()) {
        const addresses = getResendAddresses()
        if (addresses) {
          const { from, adminTo } = addresses
          const result = await sendResendReactEmail({
            from,
            to: adminTo,
            subject: `New application: ${body.jobTitle} — ${body.name}`,
            react: jsx(JobApplicationEmail, {
              jobTitle: body.jobTitle,
              name: body.name,
              email: body.email,
              phone: body.phone,
              coverLetter: body.coverLetter,
              resumeUrl: body.resumeUrl,
              linkedinUrl: body.linkedinUrl,
              submissionId: created.id,
            }),
          }).catch((err) => {
            logApiError("/api/careers/applications/email", err)
          })
          void result
        }
      }

      return apiSuccess({ id: created.id }, 201)
    } catch (error) {
      logApiError("/api/careers/applications", error)
      const mapped = mapApiError(error)
      return apiError(mapped.status, mapped.error, mapped.details)
    }
  } catch (error) {
    logApiError("/api/careers/applications", error)
    return apiError(500, "Internal server error")
  }
}
