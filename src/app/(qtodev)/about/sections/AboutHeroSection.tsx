import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Button } from "@/components/ui/shared/Button";

export function AboutHeroSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <Container>
        <div className="max-w-2xl">
          <Heading level={1} className="text-primary-foreground mb-6">
            About QTO Dev
          </Heading>
          <p className="text-xl text-primary-foreground/90 mb-8">
            We're a team of passionate developers and designers creating digital solutions
            that drive real business results.
          </p>
          <Button size="lg" variant="primary">
            Learn More
          </Button>
        </div>
      </Container>
    </section>
  );
}
