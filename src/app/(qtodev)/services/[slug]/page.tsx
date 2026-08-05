import { notFound } from "next/navigation";
import {
  findContentServiceBySlug,
} from "@/lib/cms/services";
import { findPublishedServiceSlugsForBuild } from "@/lib/prisma/buildTimePrisma";
import { skipBuildTimeD1 } from "@/lib/prisma/skipBuildTimeD1";
import { generateSEOMetadata } from "@/lib/seo";
import { HeroBanner } from "./components/HeroBanner";
import { OverviewSection } from "./components/OverviewSection";
import { ProblemsWeSolve } from "./components/ProblemsWeSolve";
import { ProcessTimeline } from "./components/ProcessTimeline";
import { RelevantWorkAndCTA } from "./components/RelevantWorkAndCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nOScgdmlld0JveD0nMCAwIDE2IDknIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzknIGZpbGw9JyNlZWYyZmYnLz48L3N2Zz4=";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = await findContentServiceBySlug(slug);

  if (!service) {
    return generateSEOMetadata({
      title: "Service Not Found",
      description: "The requested service page could not be found.",
      url: `/services/${slug}`,
      robots: { index: false, follow: false },
    });
  }

  return generateSEOMetadata({
    title: `${service.breadcrumbLabel} | QTO Dev`,
    description:
      service.subheadline?.trim() ||
      "Premium web development and design services from QTO Dev.",
    image: service.heroImage.url,
    url: `/services/${slug}`,
  });
}

export async function generateStaticParams() {
  if (skipBuildTimeD1()) return [];
  const slugs = await findPublishedServiceSlugsForBuild();
  return slugs.map((slug) => ({ slug }));
}

export default async function ServiceOfferingPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await findContentServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="scroll-smooth bg-background text-foreground" aria-label="Service details">
      <HeroBanner service={service} blurDataURL={BLUR_DATA_URL} />
      <OverviewSection service={service} blurDataURL={BLUR_DATA_URL} />
      <ProblemsWeSolve service={service} />
      <ProcessTimeline service={service} />
      <RelevantWorkAndCTA service={service} blurDataURL={BLUR_DATA_URL} />
    </main>
  );
}
