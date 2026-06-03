import { Text } from "@react-email/components";
import { SITE_NAME } from "@/lib/constants";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface ContactConfirmationProps {
  name: string;
  subject?: string;
}

export default function ContactConfirmation({
  name,
  subject,
}: ContactConfirmationProps) {
  const inquiryLine = subject
    ? ` regarding “${subject}”`
    : "";

  return (
    <EmailLayout title="We received your message">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Thank you for contacting {SITE_NAME}. We have received your message
        {inquiryLine} and will get back to you as soon as we can.
      </Text>
      <Text style={paragraph}>
        If your inquiry is urgent, you can reply to this email and our team will
        prioritize it.
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
