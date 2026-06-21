import { CTA } from "@/components/common/CTA";
import { servicesPageConfig } from "@/config/servicesPage";
type ServicesPageConfigType = typeof servicesPageConfig;

export function ServicesCTASection({ config }: { config?: ServicesPageConfigType }) {
  const cfg = config ?? servicesPageConfig;
  const { cta } = cfg;
  return (
    <CTA
      title={cta.title}
      description={cta.description}
      primaryButtonText={cta.primaryButtonText}
      primaryButtonHref={cta.primaryButtonHref}
    />
  );
}
