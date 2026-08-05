import { notFound } from "next/navigation";
import {
  findContentProjectBySlug,
} from "@/lib/cms/projects";
import { findPublishedProjectSlugsForBuild } from "@/lib/prisma/buildTimePrisma";
import { skipBuildTimeD1 } from "@/lib/prisma/skipBuildTimeD1";
import { generateSEOMetadata } from "@/lib/seo";
import { CaseStudyHero } from "./components/CaseStudyHero";
import { ProjectOverviewChallenge } from "./components/ProjectOverviewChallenge";
import { FeatureShowcase } from "./components/FeatureShowcase";
import { TechnologyAndApproach } from "./components/TechnologyAndApproach";
import { ResultsImpactAndCTA } from "./components/ResultsImpactAndCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nOScgdmlld0JveD0nMCAwIDE2IDknIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzknIGZpbGw9JyNlZWYyZmYnLz48L3N2Zz4=";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await findContentProjectBySlug(slug);

  if (!project) {
    return generateSEOMetadata({
      title: "Project Not Found",
      description: "The case study you are looking for could not be found.",
      url: `/projects/${slug}`,
      robots: { index: false, follow: false },
    });
  }

  return generateSEOMetadata({
    title: `${project.title} | QTO Dev`,
    description:
      project.subtitle?.trim() ||
      "A QTO Dev case study focused on measurable product outcomes.",
    image: project.heroImage.url,
    url: `/projects/${slug}`,
  });
}

export async function generateStaticParams() {
  if (skipBuildTimeD1()) return [];
  const slugs = await findPublishedProjectSlugsForBuild();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await findContentProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="scroll-smooth bg-background text-foreground" aria-label="Project case study">
      <CaseStudyHero project={project} blurDataURL={BLUR_DATA_URL} />
      <ProjectOverviewChallenge project={project} />
      <FeatureShowcase project={project} blurDataURL={BLUR_DATA_URL} />
      <TechnologyAndApproach project={project} />
      <ResultsImpactAndCTA project={project} />
    </main>
  );
}
