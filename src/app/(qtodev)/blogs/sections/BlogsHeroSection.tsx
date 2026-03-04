import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { blogsPageConfig } from "@/config/blogsPage";

const HEADING_ID = "blogs-hero-heading";

export function BlogsHeroSection() {
  const { hero } = blogsPageConfig;

  return (
    <section
      className="relative py-24 md:py-32 lg:py-36 bg-primary text-primary-foreground overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      {/* Decorative background headline */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden
      >
        <p
          className="font-heading text-center font-bold uppercase tracking-wide text-primary-foreground/6 select-none whitespace-nowrap px-4"
          style={{
            fontSize: "clamp(4rem, 18vw, 14rem)",
            lineHeight: 1,
          }}
        >
          Insights
        </p>
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
        <div className="max-w-2xl">
          <Heading
            id={HEADING_ID}
            level={1}
            className="text-primary-foreground mb-6 font-heading tracking-tight"
          >
            {hero.heading}
          </Heading>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed max-w-xl">
            {hero.subhead}
          </p>
        </div>
      </Container>
    </section>
  );
}
