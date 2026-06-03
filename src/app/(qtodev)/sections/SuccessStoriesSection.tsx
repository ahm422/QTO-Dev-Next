import Link from "next/link";
import { findPublishedProjects } from "@/lib/cms/projects";
import { Container } from "@/components/common/Container";

export async function SuccessStoriesSection() {
  const projects = await findPublishedProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const items = featured.length > 0 ? featured : projects.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="py-16">
      <Container>
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((project) => (
            <li key={project.id}>
              <Link href={`/projects/${project.slug}`} className="text-primary hover:underline">
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
