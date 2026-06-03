import type { ClientQuestionnairePayload } from "@/lib/validators/clientQuestionnaire";
import type { EmailFieldRow } from "@/emails/components/EmailFieldRows";

function yesNo(value: "yes" | "no"): string {
  return value === "yes" ? "Yes" : "No";
}

function joinList(items: string[]): string {
  return items.join(", ");
}

export function formatQuestionnaireSummary(
  questionnaire: ClientQuestionnairePayload
): EmailFieldRow[] {
  const rows: EmailFieldRow[] = [
    {
      label: "Services interested",
      value: joinList(questionnaire.servicesInterested),
    },
  ];

  if (questionnaire.servicesOtherSpecify?.trim()) {
    rows.push({
      label: "Other services (specify)",
      value: questionnaire.servicesOtherSpecify,
    });
  }

  rows.push({
    label: "Existing website",
    value: yesNo(questionnaire.existingWebsite),
  });

  if (questionnaire.existingWebsiteLink?.trim()) {
    rows.push({
      label: "Existing website link",
      value: questionnaire.existingWebsiteLink,
    });
  }

  rows.push({
    label: "Has domain & hosting",
    value: yesNo(questionnaire.hasDomainHosting),
  });

  rows.push({
    label: "Pages wanted",
    value: joinList(questionnaire.pagesWanted),
  });

  if (questionnaire.pagesOther?.trim()) {
    rows.push({ label: "Other pages", value: questionnaire.pagesOther });
  }

  rows.push({ label: "Content ready", value: questionnaire.contentReady });

  if (questionnaire.referenceWebsites?.trim()) {
    rows.push({
      label: "Reference websites",
      value: questionnaire.referenceWebsites,
    });
  }

  rows.push({ label: "Has logo", value: yesNo(questionnaire.hasLogo) });

  if (questionnaire.logoRedesign !== undefined) {
    rows.push({
      label: "Logo redesign or enhancement",
      value: yesNo(questionnaire.logoRedesign),
    });
  }

  if (questionnaire.logoStylePreferred?.trim()) {
    rows.push({
      label: "Logo style preferred",
      value: questionnaire.logoStylePreferred,
    });
  }

  if (questionnaire.brandColours?.trim()) {
    rows.push({ label: "Brand colours", value: questionnaire.brandColours });
  }

  if (questionnaire.brandingMaterials.length > 0) {
    rows.push({
      label: "Branding materials",
      value: joinList(questionnaire.brandingMaterials),
    });
  }

  if (questionnaire.companyDescription?.trim()) {
    rows.push({
      label: "Company description",
      value: questionnaire.companyDescription,
    });
  }

  if (questionnaire.tradesScopes?.trim()) {
    rows.push({ label: "Trades / scopes", value: questionnaire.tradesScopes });
  }

  if (questionnaire.projectKinds?.trim()) {
    rows.push({ label: "Project kinds", value: questionnaire.projectKinds });
  }

  if (questionnaire.differentiators?.trim()) {
    rows.push({
      label: "Differentiators",
      value: questionnaire.differentiators,
    });
  }

  if (questionnaire.attachmentFileNames?.length) {
    rows.push({
      label: "Attachment file names",
      value: joinList(questionnaire.attachmentFileNames),
    });
  }

  if (questionnaire.platformApproachAcknowledged) {
    rows.push({
      label: "Platform approach acknowledged",
      value: "Yes",
    });
  }

  return rows;
}
