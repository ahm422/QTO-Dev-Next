import { projects } from "@/data/projects";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";
import { Badge } from "@/components/ui/shared/Badge";

export function ProjectsGridSection() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <Card className="overflow-hidden h-full hover:shadow-lg cursor-pointer">
                <div className="h-48 bg-primary/80"></div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-foreground-muted text-sm mb-4">{project.shortDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
