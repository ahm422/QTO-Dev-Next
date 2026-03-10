import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { servicesPageConfig } from "@/config/servicesPage";

const HEADING_ID = "services-hero-heading";

export function ServicesHeroSection() {
  const { hero } = servicesPageConfig;

  return (
    <section
      className="relative py-24 md:py-32 lg:py-36 bg-primary text-primary-foreground overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      {/* Static hero backdrop using shared Pexels tech imagery */}
      <div
        className="pointer-events-none absolute inset-0 z-10 services-hero-image-bg"
        aria-hidden
      />

      <Container className="relative z-20">
        <div className="max-w-2xl rounded-2xl bg-black/65 backdrop-blur-sm px-6 py-8 md:px-8 md:py-10 text-white">
          <Heading
            id={HEADING_ID}
            level={1}
            className="text-white mb-6 font-heading tracking-tight"
          >
            {hero.heading}
          </Heading>
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-xl">
            {hero.subhead}
          </p>
          <Link
            href={hero.ctaHref}
            className={cn(
              "group inline-flex items-center gap-3 font-semibold rounded-xl transition-all duration-300",
              "px-7 py-3.5 text-lg",
              "bg-primary text-primary-foreground hover:bg-primary-hover",
              "shadow-xl shadow-black/15 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            )}
          >
            {hero.ctaText}
            <AppIcon name="arrow-right" size="sm" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
