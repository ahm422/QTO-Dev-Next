import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/content/projects";
import { CaseStudyHero } from "./components/CaseStudyHero";
import { ProjectAbout } from "./components/ProjectAbout";
import { ProblemSolution } from "./components/ProblemSolution";
import { FeatureShowcase } from "./components/FeatureShowcase";
import { OurApproach } from "./components/OurApproach";
import { TechStackStrip } from "./components/TechStackStrip";
import { TestimonialBlock } from "./components/TestimonialBlock";
import { OtherProjects } from "./components/OtherProjects";
import { ContactCTAWithLocations } from "./components/ContactCTAWithLocations";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The case study you are looking for could not be found.",
    };
  }

  return {
    title: `${project.title} | Project Case Study`,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      images: [{ url: project.heroImage.url, alt: project.heroImage.alt }],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground">
      {/* Sticky Navbar is global in layout */}

      <CaseStudyHero project={project} />
      <ProjectAbout project={project} />
      <ProblemSolution project={project} />
      <FeatureShowcase project={project} />
      <OurApproach project={project} />
      <TechStackStrip project={project} />
      <TestimonialBlock project={project} />
      <OtherProjects project={project} />
      <ContactCTAWithLocations />

      {/* Deep Footer is global in layout */}
    </main>
  );
}
