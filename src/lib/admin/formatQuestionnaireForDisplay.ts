import {
  BRANDING_CHOICES,
  PAGE_CHOICES,
  SERVICE_CHOICES,
} from "@/components/client-questionnaire/constants";
import type { ClientQuestionnairePayload } from "@/lib/validators/clientQuestionnaire";
import type { DisplayField } from "@/lib/admin/requirementDisplay";

const CONTENT_READY_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  "need-help": "Need help with content creation",
};

function labelFromChoices(
  value: string,
  choices: { value: string; label: string }[]
): string {
  return choices.find((choice) => choice.value === value)?.label ?? value;
}

function joinLabeled(
  items: string[],
  choices: { value: string; label: string }[]
): string {
  return items.map((item) => labelFromChoices(item, choices)).join(", ");
}

function yesNo(value: "yes" | "no"): string {
  return value === "yes" ? "Yes" : "No";
}

export function formatQuestionnaireForDisplay(
  questionnaire: ClientQuestionnairePayload
): DisplayField[] {
  const rows: DisplayField[] = [
    {
      label: "Services interested",
      value: joinLabeled(questionnaire.servicesInterested, SERVICE_CHOICES),
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
    value: joinLabeled(questionnaire.pagesWanted, PAGE_CHOICES),
  });

  if (questionnaire.pagesOther?.trim()) {
    rows.push({ label: "Other pages", value: questionnaire.pagesOther });
  }

  rows.push({
    label: "Content ready",
    value:
      CONTENT_READY_LABELS[questionnaire.contentReady] ??
      questionnaire.contentReady,
  });

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
      value: joinLabeled(questionnaire.brandingMaterials, BRANDING_CHOICES),
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
      value: questionnaire.attachmentFileNames.join(", "),
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

export function getQuestionnaireFromMetadata(
  metadata: Record<string, unknown> | null
): ClientQuestionnairePayload | null {
  const questionnaire = metadata?.questionnaire;
  if (!questionnaire || typeof questionnaire !== "object" || Array.isArray(questionnaire)) {
    return null;
  }
  return questionnaire as ClientQuestionnairePayload;
}
