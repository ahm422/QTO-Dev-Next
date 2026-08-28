/**
 * Formats free typing into the canonical Pakistani CNIC shape
 * `12345-1234567-1` (5-7-1 digit groups) as the user types. Strips every
 * non-digit, caps at 13 digits, and re-inserts the dashes. A value that is
 * already canonical passes through unchanged. See `CNIC_REGEX` in
 * `src/lib/validators/employees/employee.ts`.
 */
export function formatCnic(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 13)
  const parts = [digits.slice(0, 5), digits.slice(5, 12), digits.slice(12, 13)].filter(Boolean)
  return parts.join("-")
}
