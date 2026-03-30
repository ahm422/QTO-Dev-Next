import type { Metadata } from "next";
import { RequirementsIntakePage } from "@/components/requirements/RequirementsIntakePage";

export const metadata: Metadata = {
  title: "Get a Quote (Moved) | QTO Dev",
  description: "This page has moved to /requirements.",
  robots: { index: false, follow: true },
};

export default function GetAQuotePage() {
  return (
    <RequirementsIntakePage
      analyticsPath="/get-a-quote"
      source="get-a-quote"
      eyebrow="Get a quote"
      title="Share your requirements (moved)"
      subtitle="This page is now called Requirements. Use the canonical URL for sharing and bookmarking."
      movedNotice={{ label: "Looking for the canonical page?", href: "/requirements" }}
    />
  );
}

