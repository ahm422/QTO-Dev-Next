import { Card } from "@/components/ui/card";
import { projects } from "@/data/projects";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";

export function SuccessStoriesSection() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-16">
      <Container>
        <SectionHeader
          subtitle="Case Studies"
          title="Success Stories"
          description="Transforming businesses through innovative technology solutions"
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg">
              <div className="h-40 bg-primary/80"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-foreground-muted text-sm mb-4">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-surface-muted text-foreground-muted px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
