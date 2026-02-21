import { CTA } from "@/components/common/CTA";

export function CTASection() {
  return (
    <CTA
      title="Ready to Transform Your Business?"
      description="Let's build something amazing together."
      primaryButtonText="Start Your Project"
      primaryButtonHref="/contact"
      secondaryButtonText="View Our Work"
      secondaryButtonHref="/projects"
    />
  );
}
