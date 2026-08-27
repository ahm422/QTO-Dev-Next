import { Text } from "@react-email/components";
import { EmailFieldRows } from "@/emails/components/EmailFieldRows";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface HrOnboardingNoticeProps {
  name: string;
  employeeCode: string;
  department?: string | null;
  createdByEmail?: string | null;
  adminUrl: string;
}

export default function HrOnboardingNotice({
  name,
  employeeCode,
  department,
  createdByEmail,
  adminUrl,
}: HrOnboardingNoticeProps) {
  const rows = [
    { label: "Name", value: name },
    { label: "Employee Code", value: employeeCode },
    ...(department ? [{ label: "Department", value: department }] : []),
    ...(createdByEmail ? [{ label: "Created by", value: createdByEmail }] : []),
  ];

  return (
    <EmailLayout title="New employee record created">
      <EmailFieldRows rows={rows} />
      <Text style={intro}>
        <a href={adminUrl}>View in admin</a>
      </Text>
    </EmailLayout>
  );
}

const intro = {
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "16px 0 0",
};
