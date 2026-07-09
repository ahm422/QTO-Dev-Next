/**
 * Parse display stat strings like "120+", "98%", "+15" into AnimatedCounter parts.
 */
export function parseStatValue(
  value: string
): { numeric: number; prefix: string; suffix: string } | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/);
  if (!match) return null;

  const [, prefix = "", numStr, suffix = ""] = match;
  const numeric = Number.parseFloat(numStr);
  if (!Number.isFinite(numeric)) return null;

  return { numeric, prefix, suffix };
}
