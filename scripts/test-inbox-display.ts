/**
 * Quick assertions for inbox display fallbacks.
 * Run: npx tsx scripts/test-inbox-display.ts
 */
import {
  displayContactName,
  displayContactSubject,
  displayPhone,
  displayRequirementName,
} from "../src/lib/admin/inboxDisplay";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`OK: ${message}`);
}

assert(
  displayContactName({ name: "  Alice  ", metadata: null }) === "Alice",
  "trims top-level name"
);
assert(
  displayContactName({ name: "", metadata: { name: "Bob" } }) === "Bob",
  "falls back to metadata.name"
);
assert(
  displayContactName({ name: "", metadata: null }) === "—",
  "empty name shows dash"
);
assert(
  displayContactSubject({ subject: "" }) === "General Inquiry",
  "empty subject defaults to General Inquiry"
);
assert(
  displayContactSubject({ subject: "  Custom  " }) === "Custom",
  "trims subject"
);
assert(
  displayRequirementName({ name: "", metadata: { name: "Legacy" } }) === "Legacy",
  "requirement name fallback"
);
assert(
  displayPhone({ phone: "+1 555-0100" }) === "+1 555-0100",
  "phone from metadata"
);
assert(displayPhone(null) === "—", "missing phone shows dash");

console.log("\nAll inbox display helper assertions passed.");
