import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";

export function WhatWeDoSection() {
  return (
    <section className="py-16 bg-surface">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutData.whatWeDo.map((item, i) => (
            <Card key={i} className="p-6 hover:shadow-lg">
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-foreground-muted text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
