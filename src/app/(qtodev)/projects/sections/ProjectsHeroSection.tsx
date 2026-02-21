import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Button } from "@/components/ui/shared/Button";

export function ProjectsHeroSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <Container>
        <div className="max-w-2xl">
          <Heading level={1} className="text-primary-foreground mb-6">
            Our Portfolio
          </Heading>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Explore our latest projects and case studies showcasing innovative solutions
          </p>
          <Button size="lg" variant="primary">
            Get In Touch
          </Button>
        </div>
      </Container>
    </section>
  );
}
