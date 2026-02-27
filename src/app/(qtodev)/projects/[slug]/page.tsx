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

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nOScgdmlld0JveD0nMCAwIDE2IDknIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzknIGZpbGw9JyNlZWYyZmYnLz48L3N2Zz4=";

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
    <main className="scroll-smooth bg-background text-foreground" aria-label="Project case study">
      <CaseStudyHero project={project} blurDataURL={BLUR_DATA_URL} />
      <ProjectAbout project={project} />
      <ProblemSolution project={project} />
      <FeatureShowcase project={project} blurDataURL={BLUR_DATA_URL} />
      <OurApproach project={project} />
      <TechStackStrip project={project} />
      <TestimonialBlock project={project} />
      <OtherProjects project={project} />
      <ContactCTAWithLocations />
    </main>
  );
}
