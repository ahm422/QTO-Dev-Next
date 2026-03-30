import { ContactHeroSection } from "./sections/ContactHeroSection";
import { ContactFormSection } from "./sections/ContactFormSection";
import { ContactDetailsSection } from "./sections/ContactDetailsSection";
import { BookCallSection } from "@/components/contact/BookCallSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | QTO Dev",
  description:
    "Get in touch with QTO Dev. Send a message or book a call to discuss your project.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactFormSection />
      <BookCallSection
        analyticsPath="/contact#book-a-call"
        source="contact"
        anchorId="book-a-call"
      />
      <ContactDetailsSection />
    </>
  );
}
