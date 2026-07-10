import type { ParsedMetadata } from "@/lib/admin/inboxDisplay";
import { displayCompanyLocation, displayPhone } from "@/lib/admin/inboxDisplay";

export type DisplayField = { label: string; value: string };

export type RequirementDisplayInput = {
  intent: string;
  company?: string | null;
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
  metadata?: ParsedMetadata;
};

function optionalField(
  label: string,
  value: string | null | undefined
): DisplayField | null {
  const trimmed = value?.trim();
  return trimmed ? { label, value: trimmed } : null;
}

export function buildRequirementContactFields(
  row: RequirementDisplayInput & { name: string; email: string }
): DisplayField[] {
  const meta = row.metadata ?? null;
  return [
    { label: "Name", value: row.name?.trim() || "—" },
    { label: "Email", value: row.email },
    { label: "Phone", value: displayPhone(meta) },
  ];
}

export function buildRequirementProjectFields(
  row: RequirementDisplayInput
): DisplayField[] {
  const meta = row.metadata ?? null;
  return [
    { label: "Intent", value: row.intent },
    ...([
      optionalField("Company", row.company),
      optionalField("Company location", displayCompanyLocation(meta) !== "—" ? displayCompanyLocation(meta) : null),
      optionalField("Website", row.website),
      optionalField("Role", row.role),
      optionalField("Project type", row.projectType),
      optionalField("Industry", row.industry),
      optionalField("Company size", row.companySize),
      optionalField("Goals", row.goals),
      optionalField("Budget range", row.budgetRange),
      optionalField("Start date", row.startDate),
      optionalField("Launch window", row.launchWindow),
      optionalField("Urgency", row.urgency),
      optionalField("Timeline", row.timeline),
      optionalField("Preferred time", row.preferredTime),
      optionalField("Timezone", row.timezone),
      optionalField("Channel", row.channel),
      optionalField("Features", row.features),
      optionalField("Integrations", row.integrations),
      optionalField("Success criteria", row.successCriteria),
    ].filter((field): field is DisplayField => field !== null)),
  ];
}

export function buildTrackingFields(row: {
  source?: string | null;
  referrer?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}): DisplayField[] {
  return [
    ...([
      optionalField("Source", row.source),
      optionalField("Referrer", row.referrer),
      optionalField("IP", row.ip),
      optionalField("User agent", row.userAgent),
    ].filter((field): field is DisplayField => field !== null)),
  ];
}
