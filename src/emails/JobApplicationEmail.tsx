import { Heading, Text, Link } from "@react-email/components"
import { EmailFieldRows } from "@/emails/components/EmailFieldRows"
import { EmailLayout } from "@/emails/components/EmailLayout"

export interface JobApplicationEmailProps {
  jobTitle: string
  name: string
  email: string
  phone?: string | null
  coverLetter?: string | null
  resumeUrl?: string | null
  linkedinUrl?: string | null
  submissionId?: string
}

export default function JobApplicationEmail({
  jobTitle,
  name,
  email,
  phone,
  coverLetter,
  resumeUrl,
  linkedinUrl,
  submissionId,
}: JobApplicationEmailProps) {
  const rows = [
    { label: "Position", value: jobTitle },
    { label: "Name", value: name },
    { label: "Email", value: email },
    ...(phone ? [{ label: "Phone", value: phone }] : []),
    ...(linkedinUrl ? [{ label: "LinkedIn", value: linkedinUrl }] : []),
    ...(resumeUrl ? [{ label: "Resume", value: resumeUrl }] : []),
    ...(submissionId ? [{ label: "Application ID", value: submissionId }] : []),
  ]

  return (
    <EmailLayout title="New job application">
      <Heading as="h2" style={sectionHeading}>
        Application details
      </Heading>
      <EmailFieldRows rows={rows} />
      {coverLetter && (
        <>
          <Heading as="h2" style={sectionHeading}>
            Cover letter
          </Heading>
          <Text style={messageBlock}>{coverLetter}</Text>
        </>
      )}
    </EmailLayout>
  )
}

const sectionHeading = {
  color: "#111111",
  fontSize: "17px",
  fontWeight: "600",
  margin: "24px 0 12px",
}

const messageBlock = {
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  padding: "16px",
  whiteSpace: "pre-wrap" as const,
}
