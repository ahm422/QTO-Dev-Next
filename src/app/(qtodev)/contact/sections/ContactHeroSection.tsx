import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";

export function ContactHeroSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <Container>
        <div className="max-w-2xl">
          <Heading level={1} className="text-primary-foreground mb-6">
            Get In Touch
          </Heading>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Have a project in mind? We'd love to hear about it. Let's discuss how we can help
            transform your business.
          </p>
        </div>
      </Container>
    </section>
  );
}
