import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";

export function VisionSection() {
  return (
    <section className="py-16">
      <Container>
        <Card className="p-12 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl text-foreground-muted leading-relaxed">
            {aboutData.vision}
          </p>
        </Card>
      </Container>
    </section>
  );
}
