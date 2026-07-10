import { ContactHeroSection } from "./sections/ContactHeroSection";
import { ContactFormSection } from "./sections/ContactFormSection";
import { ContactDetailsSection } from "./sections/ContactDetailsSection";
import { getTrustMetrics } from "@/lib/cms/stats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | QTO Dev",
  description:
    "Get in touch with QTO Dev. Send a message and we’ll follow up with clear next steps.",
};

export default async function ContactPage() {
  const metrics = await getTrustMetrics();

  return (
    <>
      <ContactHeroSection />
      <ContactFormSection metrics={metrics} />
      <ContactDetailsSection />
    </>
  );
}
