import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";

export function TrustSection() {
  const reasons = [
    "10+ years of combined experience",
    "150+ successful projects",
    "99.9% client satisfaction rate",
    "On-time and on-budget delivery",
    "Dedicated support team",
    "Transparent communication",
  ];

  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          title="Why Clients Trust Us"
          description="We're committed to excellence in every project"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {reasons.map((reason, i) => (
            <div key={i} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground mt-1 mr-4">
                ✓
              </span>
              <span className="text-foreground-muted">{reason}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
