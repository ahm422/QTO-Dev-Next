import { ContactHeroSection } from "./sections/ContactHeroSection";
import { ContactFormSection } from "./sections/ContactFormSection";
import { ContactDetailsSection } from "./sections/ContactDetailsSection";
import { getTrustMetrics } from "@/lib/cms/stats";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Contact | QTO Dev",
  description:
    "Get in touch with QTO Dev. Send a message and we’ll follow up with clear next steps.",
  url: "/contact",
});

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
