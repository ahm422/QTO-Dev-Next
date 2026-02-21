import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/shared/Card";

export function HighlightsSection() {
  const highlights = [
    { icon: "⚡", label: "Lightning Fast", description: "Performance optimized" },
    { icon: "🔒", label: "Secure", description: "Enterprise-grade security" },
    { icon: "📱", label: "Responsive", description: "Works on all devices" },
    { icon: "♿", label: "Accessible", description: "WCAG compliant" },
    { icon: "📈", label: "Scalable", description: "Grows with your business" },
    { icon: "🌍", label: "Global", description: "Available worldwide" },
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
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold mb-2">{item.label}</h3>
              <p className="text-foreground-muted text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
