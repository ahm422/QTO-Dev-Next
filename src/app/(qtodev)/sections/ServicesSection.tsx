import { Card } from "@/components/ui/shared/Card";
import { services } from "@/data/services";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";

export function ServicesSection() {
  return (
    <section className="py-16 bg-surface">
      <Container>
        <SectionHeader
          subtitle="Our Expertise"
          title="What We Offer"
          description="Comprehensive technology solutions tailored to your business needs"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {services.map((service) => (
            <Card key={service.id} className="p-6 hover:shadow-lg">
              <AppIcon name={service.icon as AppIconName} size="lg" className="mb-4" />
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-foreground-muted text-sm">{service.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.features.slice(0, 2).map((feature, i) => (
                  <span key={i} className="text-xs bg-primary/15 text-primary px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
