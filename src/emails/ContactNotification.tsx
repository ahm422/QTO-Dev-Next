import { Heading, Text } from "@react-email/components";
import { EmailFieldRows } from "@/emails/components/EmailFieldRows";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: string | null;
  referrer?: string | null;
  submissionId?: string;
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
  source,
  referrer,
  submissionId,
}: ContactNotificationProps) {
  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Subject", value: subject },
    ...(submissionId ? [{ label: "Submission ID", value: submissionId }] : []),
    ...(source ? [{ label: "Source", value: source }] : []),
    ...(referrer ? [{ label: "Referrer", value: referrer }] : []),
  ];

  return (
    <EmailLayout title="New contact form submission">
      <Heading as="h2" style={sectionHeading}>
        Contact details
      </Heading>
      <EmailFieldRows rows={rows} />
      <Heading as="h2" style={sectionHeading}>
        Message
      </Heading>
      <Text style={messageBlock}>{message}</Text>
    </EmailLayout>
  );
}

const sectionHeading = {
  color: "#111111",
  fontSize: "17px",
  fontWeight: "600",
  margin: "24px 0 12px",
};

const messageBlock = {
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  padding: "16px",
  whiteSpace: "pre-wrap" as const,
};
