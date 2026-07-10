export type ParsedMetadata = Record<string, unknown> | null;

export type InboxRowWithName = {
  name: string;
  metadata?: ParsedMetadata;
};

export type ContactInboxRowFields = InboxRowWithName & {
  subject: string;
};

function getMetadataString(
  meta: ParsedMetadata,
  key: string
): string | null {
  const value = meta?.[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function displayOrDash(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed || "—";
}

export function displayContactName(row: InboxRowWithName): string {
  return (
    row.name?.trim() ||
    getMetadataString(row.metadata ?? null, "name") ||
    "—"
  );
}

export function displayContactSubject(row: { subject: string }): string {
  return row.subject?.trim() || "General Inquiry";
}

export function displayRequirementName(row: InboxRowWithName): string {
  return displayContactName(row);
}

export function displayPhone(meta: ParsedMetadata): string {
  return displayOrDash(getMetadataString(meta, "phone"));
}

export function displayCompanyLocation(meta: ParsedMetadata): string {
  return displayOrDash(getMetadataString(meta, "companyLocation"));
}

export function formatInboxDate(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatInboxDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
