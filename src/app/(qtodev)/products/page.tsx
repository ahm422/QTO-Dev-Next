import { ProductsHeroSection } from "./sections/ProductsHeroSection";
import { ErpProductSection } from "./sections/ErpProductSection";
import { ConstructQuestSection } from "./sections/ConstructQuestSection";
import { CTA } from "@/components/common/CTA";
import { productsPageConfig } from "@/config/productsPage";

export default function ProductsPage() {
  const { cta } = productsPageConfig;

  return (
    <>
      <ProductsHeroSection />
      <ErpProductSection />
      <ConstructQuestSection />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
