import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";

const HEADING_ID = "contact-hero-heading";

export function ContactHeroSection() {
  return (
    <section
      className="relative py-24 md:py-32 lg:py-36 bg-primary text-primary-foreground overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 z-0 page-hero-image-bg"
        aria-hidden
      />

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
            Get In Touch
          </Heading>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-xl mx-auto animation-delay-150 animate-hero-content-fade animation-fill-backwards">
            Have a project in mind? We&apos;d love to hear about it. Let&apos;s discuss how we can help
            transform your business.
          </p>
        </div>
      </Container>
    </section>
  );
}
