import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/shared/Button";

export function HeroSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Beautiful Web Solutions for Modern Business
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
            We build fast, scalable, and beautiful web applications that drive growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="primary">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-hover">
              Learn More
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
