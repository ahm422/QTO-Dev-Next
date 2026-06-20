import { Link, Text } from "@react-email/components";
import { SITE_NAME } from "@/lib/constants";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface PasswordResetEmailProps {
  resetUrl: string;
  expiresInMinutes?: number;
}

export default function PasswordResetEmail({
  resetUrl,
  expiresInMinutes = 60,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout title="Reset your password">
      <Text style={paragraph}>Hi,</Text>
      <Text style={paragraph}>
        We received a request to reset the password for your {SITE_NAME} admin account. Click the
        link below to choose a new password:
      </Text>
      <Text style={paragraph}>
        <Link href={resetUrl} style={resetLink}>
          Reset password
        </Link>
      </Text>
      <Text style={paragraph}>
        This link expires in {expiresInMinutes} minutes. If you did not request a password reset,
        you can safely ignore this email — your password will not change.
      </Text>
      <Text style={paragraph}>— The {SITE_NAME} team</Text>
    </EmailLayout>
  );
}

const paragraph = {
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const resetLink = {
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "underline",
};
