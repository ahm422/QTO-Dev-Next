import type { Metadata } from "next";
import { RequirementsHero } from "@/components/requirements/RequirementsHero";
import { RequirementsIntakePage } from "@/components/requirements/RequirementsIntakePage";

export const metadata: Metadata = {
  title: "Project Requirements | QTO Dev",
  description:
    "Share your project requirements and goals. We'll follow up with clear next steps within 1–2 business days.",
};

export default function RequirementsPage() {
  return (
    <>
      <RequirementsHero
        badge="Requirements"
        title="Tell us what you're building"
        description="Share your goals, constraints, and must-haves. We'll reply with practical next steps and a clear plan."
      />
      <RequirementsIntakePage
        analyticsPath="/requirements"
        source="requirements"
        eyebrow="Requirements"
        title="Tell us what you're building"
        subtitle="Share your goals, constraints, and must-haves. We'll reply with practical next steps and a clear plan."
      />
    </>
  );
}
