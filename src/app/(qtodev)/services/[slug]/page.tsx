import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/content/services";
import { services } from "@/data/services";
import { HeroBanner } from "./components/HeroBanner";
import { OverviewSection } from "./components/OverviewSection";
import { ProcessTimeline } from "./components/ProcessTimeline";
import { TechStackStrip } from "./components/TechStackStrip";
import { RelatedProjects } from "./components/RelatedProjects";
import { ServicePackages } from "./components/ServicePackages";
import { TrustSection } from "./components/TrustSection";
import { ContactCTA } from "./components/ContactCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nOScgdmlld0JveD0nMCAwIDE2IDknIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzknIGZpbGw9JyNlZWYyZmYnLz48L3N2Zz4=";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service page could not be found.",
    };
  }

  return {
    title: `${service.breadcrumbLabel} | QTO Dev Services`,
    description: service.subheadline,
    openGraph: {
      title: service.headline,
      description: service.subheadline,
      images: [{ url: service.heroImage.url, alt: service.heroImage.alt }],
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceOfferingPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="scroll-smooth bg-background text-foreground" aria-label="Service details">
      {/* 1. Sticky Navbar rendered globally in (qtodev)/layout.tsx */}

      {/* 2. Hero Banner */}
      <HeroBanner service={service} blurDataURL={BLUR_DATA_URL} />

      {/* 3. Overview Section */}
      <OverviewSection service={service} blurDataURL={BLUR_DATA_URL} />

      {/* 4. Process Timeline */}
      <ProcessTimeline service={service} />

      {/* 5. Tech Stack Strip */}
      <TechStackStrip service={service} blurDataURL={BLUR_DATA_URL} />

      {/* 6. Related / Recent Projects */}
      <RelatedProjects service={service} blurDataURL={BLUR_DATA_URL} />

      {/* 7. Service Offerings */}
      <ServicePackages service={service} />

      {/* 8. Proof / Trust Section */}
      <TrustSection service={service} blurDataURL={BLUR_DATA_URL} />

      {/* 9. Final CTA + Contact Form */}
      <ContactCTA />

      {/* 10. Deep Footer rendered globally in (qtodev)/layout.tsx */}
    </main>
  );
}
