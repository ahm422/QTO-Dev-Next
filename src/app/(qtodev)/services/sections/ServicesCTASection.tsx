import { CTA } from "@/components/common/CTA";
import { servicesPageConfig } from "@/config/servicesPage";

export function ServicesCTASection() {
  const { cta } = servicesPageConfig;
  return (
    <CTA
      title={cta.title}
      description={cta.description}
      primaryButtonText={cta.primaryButtonText}
      primaryButtonHref={cta.primaryButtonHref}
    />
  );
}
