import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Button } from "@/components/ui/shared/Button";

export function ServicesHeroSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <Container>
        <div className="max-w-2xl">
          <Heading level={1} className="text-primary-foreground mb-6">
            Our Services
          </Heading>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Comprehensive technology solutions designed to accelerate your business growth
          </p>
          <Button size="lg" variant="primary">
            Get in Touch
          </Button>
        </div>
      </Container>
    </section>
  );
}
