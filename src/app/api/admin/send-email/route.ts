import { NextRequest } from "next/server";
import { jsx } from "react/jsx-runtime";
import AdminMessageEmail from "@/emails/AdminMessageEmail";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { apiError, apiSuccess, logApiError } from "@/lib/apiResponses";
import {
  getEmailAddresses,
  isEmailConfigured,
  sendReactEmail,
} from "@/lib/email";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { adminSendEmailSchema } from "@/lib/validators/admin/sendEmail";

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminSession({
    allowedRoles: ["super_admin", "admin", "editor"],
  });
  if (error) return error;

  try {
    let data: unknown;
    try {
      data = await request.json();
    } catch {
      return apiError(400, "Validation failed", {
        fieldErrors: { body: ["Request body must be valid JSON"] },
      });
    }

    const parsed = adminSendEmailSchema.safeParse(data);
    if (!parsed.success) {
      return apiError(400, "Validation failed", {
        fieldErrors: formatZodFieldErrors(parsed.error),
      });
    }

    if (!isEmailConfigured()) {
      return apiError(503, "Email is not configured on this Worker");
    }

    const addresses = getEmailAddresses();
    if (!addresses) {
      return apiError(503, "EMAIL_FROM or EMAIL_ADMIN_TO is missing");
    }

    const { to, subject, message, recipientName } = parsed.data;
    const { from, adminTo } = addresses;

    try {
      await sendReactEmail({
        from,
        to,
        replyTo: adminTo,
        subject,
        react: jsx(AdminMessageEmail, {
          recipientName: recipientName ?? null,
          body: message,
        }),
      });
    } catch (sendError) {
      logApiError("/api/admin/send-email", sendError);
      return apiError(502, "Failed to send email");
    }

    return apiSuccess({
      to,
      subject,
      sentBy: session!.user.email,
    });
  } catch (err) {
    logApiError("/api/admin/send-email", err);
    return apiError(500, "Internal server error");
  }
}
