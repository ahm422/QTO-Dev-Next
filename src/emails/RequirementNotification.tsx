import { Heading, Text } from "@react-email/components";
import type { ClientQuestionnairePayload } from "@/lib/validators/clientQuestionnaire";
import {
  EmailFieldRows,
  type EmailFieldRow,
} from "@/emails/components/EmailFieldRows";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { formatQuestionnaireSummary } from "@/emails/formatQuestionnaireSummary";

export interface RequirementNotificationProps {
  intent: string;
  name: string;
  email: string;
  message: string;
  submissionId?: string;
  phone?: string | null;
  company?: string | null;
  companyLocation?: string | null;
  website?: string | null;
  role?: string | null;
  projectType?: string | null;
  industry?: string | null;
  companySize?: string | null;
  goals?: string | null;
  budgetRange?: string | null;
  startDate?: string | null;
  launchWindow?: string | null;
  urgency?: string | null;
  timeline?: string | null;
  preferredTime?: string | null;
  timezone?: string | null;
  channel?: string | null;
  features?: string | null;
  integrations?: string | null;
  successCriteria?: string | null;
  source?: string | null;
  referrer?: string | null;
  questionnaire?: ClientQuestionnairePayload;
}

function optionalRow(
  label: string,
  value: string | null | undefined
): EmailFieldRow | null {
  const trimmed = value?.trim();
  return trimmed ? { label, value: trimmed } : null;
}

function buildProjectRows(props: RequirementNotificationProps): EmailFieldRow[] {
  return [
    { label: "Intent", value: props.intent },
    ...([
      optionalRow("Company", props.company),
      optionalRow("Company location", props.companyLocation),
      optionalRow("Phone", props.phone),
      optionalRow("Website", props.website),
      optionalRow("Role", props.role),
      optionalRow("Project type", props.projectType),
      optionalRow("Industry", props.industry),
      optionalRow("Company size", props.companySize),
      optionalRow("Goals", props.goals),
      optionalRow("Budget range", props.budgetRange),
      optionalRow("Start date", props.startDate),
      optionalRow("Launch window", props.launchWindow),
      optionalRow("Urgency", props.urgency),
      optionalRow("Timeline", props.timeline),
      optionalRow("Preferred time", props.preferredTime),
      optionalRow("Timezone", props.timezone),
      optionalRow("Channel", props.channel),
      optionalRow("Features", props.features),
      optionalRow("Integrations", props.integrations),
      optionalRow("Success criteria", props.successCriteria),
      optionalRow("Source", props.source),
      optionalRow("Referrer", props.referrer),
    ].filter((row): row is EmailFieldRow => row !== null)),
  ];
}

export default function RequirementNotification(
  props: RequirementNotificationProps
) {
  const { name, email, message, submissionId, questionnaire } = props;

  const contactRows: EmailFieldRow[] = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    ...(submissionId ? [{ label: "Submission ID", value: submissionId }] : []),
  ];

  return (
    <EmailLayout title="New project requirements submission">
      <Heading as="h2" style={sectionHeading}>
        Contact
      </Heading>
      <EmailFieldRows rows={contactRows} />

      <Heading as="h2" style={sectionHeading}>
        Project details
      </Heading>
      <EmailFieldRows rows={buildProjectRows(props)} />

      <Heading as="h2" style={sectionHeading}>
        Message
      </Heading>
      <Text style={messageBlock}>{message}</Text>

      {questionnaire ? (
        <>
          <Heading as="h2" style={sectionHeading}>
            Client questionnaire
          </Heading>
          <EmailFieldRows rows={formatQuestionnaireSummary(questionnaire)} />
        </>
      ) : null}
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
