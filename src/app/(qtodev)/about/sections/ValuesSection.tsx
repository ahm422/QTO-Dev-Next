import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";

export function ValuesSection() {
  return (
    <section className="py-16 bg-surface">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutData.values.map((value, i) => (
            <Card key={i} className="p-6 text-center hover:shadow-lg">
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-foreground-muted">{value.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
