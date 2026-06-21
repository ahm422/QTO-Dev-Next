import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;
import Image from "next/image";
import { PEXELS_TECH_IMAGES } from "@/config/pexelsImages";

const HEADING_ID = "blogs-hero-heading";

export function BlogsHeroSection({ config }: { config?: BlogsPageConfigType }) {
  const cfg = config ?? blogsPageConfig;
  const { hero } = cfg;
  const heroImage = PEXELS_TECH_IMAGES[4];

  return (
    <section
      className="relative py-24 md:py-32 lg:py-36 bg-hero-bg text-white overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      {/* Background image (optimized via next/image) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 page-hero-image-bg blogs-hero-bg" aria-hidden />
      </div>

      {/* Rich gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(ellipse 70% 50% at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 45%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 60%)",
        }}
      />

      <Container className="relative z-20">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <Heading
            id={HEADING_ID}
            level={1}
            className="text-white mb-6 font-heading tracking-tight animate-hero-content-fade animation-fill-backwards"
          >
            {hero.heading}
          </Heading>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-xl mx-auto animation-delay-150 animate-hero-content-fade animation-fill-backwards">
            {hero.subhead}
          </p>
        </div>
      </Container>
    </section>
  );
}
