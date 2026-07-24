import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { RelatedProjects } from "./RelatedProjects";
import { ServicePackages } from "./ServicePackages";
import { ContactCTA } from "./ContactCTA";

interface RelevantWorkAndCTAProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function RelevantWorkAndCTA({ service, blurDataURL }: RelevantWorkAndCTAProps) {
  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby="relevant-work-heading"
    >
      <div
        className="pointer-events-none absolute top-0 left-0 h-64 w-80 -translate-x-1/4 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative space-y-16 md:space-y-20">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Relevant work & next steps"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Relevant Work & Final CTA"
              description="See how we ship for this service, pick a package, then start a conversation."
              headingId="relevant-work-heading"
              centered={false}
            />
          </div>
        </Reveal>

        <RelatedProjects service={service} blurDataURL={blurDataURL} embedded />
        <ServicePackages service={service} embedded />
        <ContactCTA embedded />
      </Container>
    </section>
  );
}
