/** Convert stored string[] → textarea display value */
export function arrayToLines(arr: string[] | undefined | null): string {
  return (arr ?? []).join("\n");
}

/** Normalize textarea text → clean string[] for save/validation */
export function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** During typing: preserve empty lines so Enter works */
export function linesToDraftArray(text: string): string[] {
  return text.split("\n");
}
