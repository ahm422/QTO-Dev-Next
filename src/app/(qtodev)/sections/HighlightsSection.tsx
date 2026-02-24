import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/shared/Card";
import { AppIcon } from "@/components/ui/shared/AppIcon";

export function HighlightsSection() {
  const highlights = [
    { icon: "bolt" as const, label: "Lightning Fast", description: "Performance optimized" },
    { icon: "lock" as const, label: "Secure", description: "Enterprise-grade security" },
    { icon: "mobile-screen" as const, label: "Responsive", description: "Works on all devices" },
    { icon: "universal-access" as const, label: "Accessible", description: "WCAG compliant" },
    { icon: "chart-line" as const, label: "Scalable", description: "Grows with your business" },
    { icon: "globe" as const, label: "Global", description: "Available worldwide" },
  ];

  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          subtitle="Why Choose Us"
          title="Key Highlights"
          description="Industry-leading practices and proven results"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {highlights.map((item, i) => (
            <Card key={i} className="p-6 text-center hover:shadow-lg">
              <AppIcon name={item.icon} size="lg" className="mb-4" />
              <h3 className="font-bold mb-2">{item.label}</h3>
              <p className="text-foreground-muted text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
