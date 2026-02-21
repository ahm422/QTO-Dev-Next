import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";

export function ProcessSection() {
  const steps = [
    { number: "01", title: "Discovery", description: "We understand your business goals" },
    { number: "02", title: "Strategy", description: "Plan the perfect solution" },
    { number: "03", title: "Development", description: "Build with cutting-edge tech" },
    { number: "04", title: "Launch", description: "Deploy and optimize" },
  ];

  return (
    <section className="py-16 bg-surface">
      <Container>
        <SectionHeader
          subtitle="How We Work"
          title="Our Process"
          description="A proven methodology to deliver excellence"
        />

        <div className="grid md:grid-cols-4 gap-8 mt-12">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="font-heading text-5xl font-bold text-foreground-muted mb-4">{step.number}</div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-foreground-muted text-sm">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-border"></div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
