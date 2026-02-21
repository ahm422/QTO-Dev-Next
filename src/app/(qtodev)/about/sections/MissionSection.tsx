import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";

export function MissionSection() {
  return (
    <section className="py-16">
      <Container>
        <Card className="p-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-foreground-muted leading-relaxed">
            {aboutData.mission}
          </p>
        </Card>
      </Container>
    </section>
  );
}
