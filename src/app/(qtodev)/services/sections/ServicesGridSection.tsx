import Link from "next/link";
import { services } from "@/data/services";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";
import { Button } from "@/components/ui/shared/Button";

export function ServicesGridSection() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="p-8">
              <div className="text-5xl mb-6">{service.icon}</div>
              <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
              <p className="text-foreground-muted mb-6">{service.description}</p>

              <div className="mb-8">
                <h3 className="font-semibold mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-foreground-muted">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={`/services/${service.slug}`}>
                <Button variant="primary" size="md" className="w-full">
                  Learn More
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
