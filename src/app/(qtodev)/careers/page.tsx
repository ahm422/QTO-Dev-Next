import { generateSEOMetadata } from "@/lib/seo";
import { CareersHeroSection } from "./sections/CareersHeroSection";
import { OpenPositionsSection } from "./sections/OpenPositionsSection";
import { CareersCTASection } from "./sections/CareersCTASection";

export const metadata = generateSEOMetadata({
  title: "Careers at QTO Dev",
  description:
    "Join QTO Dev and build impactful digital products with a team that values craft, learning, and flexible, modern ways of working.",
  url: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <CareersHeroSection />
      <OpenPositionsSection />
      <CareersCTASection />
    </>
  );
}

