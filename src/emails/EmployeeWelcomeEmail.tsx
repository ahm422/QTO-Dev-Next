import { Text } from "@react-email/components";
import { EmailFieldRows } from "@/emails/components/EmailFieldRows";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface EmployeeWelcomeEmailProps {
  name: string;
  employeeCode: string;
  designation?: string | null;
  department?: string | null;
  cardUrl: string;
}

export default function EmployeeWelcomeEmail({
  name,
  employeeCode,
  designation,
  department,
  cardUrl,
}: EmployeeWelcomeEmailProps) {
  const rows = [
    { label: "Name", value: name },
    { label: "Employee Code", value: employeeCode },
    ...(designation ? [{ label: "Designation", value: designation }] : []),
    ...(department ? [{ label: "Department", value: department }] : []),
  ];

  return (
    <EmailLayout title={`Welcome, ${name}!`}>
      <Text style={intro}>
        Your employee record has been created. Your QR-coded employee card is available at the link below.
      </Text>
      <EmailFieldRows rows={rows} />
      <Text style={intro}>
        <a href={cardUrl}>{cardUrl}</a>
      </Text>
    </EmailLayout>
  );
}

const intro = {
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};
