import { Text } from "@react-email/components";
import { SITE_NAME } from "@/lib/constants";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface AdminMessageEmailProps {
  recipientName?: string | null;
  body: string;
}

export default function AdminMessageEmail({
  recipientName,
  body,
}: AdminMessageEmailProps) {
  const greeting = recipientName?.trim()
    ? `Hi ${recipientName.trim()},`
    : "Hello,";

  return (
    <EmailLayout title="Message from our team">
      <Text style={paragraph}>{greeting}</Text>
      {body.split(/\n{2,}/).map((block, i) => (
        <Text key={i} style={paragraph}>
          {block.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </Text>
      ))}
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
