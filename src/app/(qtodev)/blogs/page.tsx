import { BlogsHeroSection } from "./sections/BlogsHeroSection";
import { FeaturedPostsSection } from "./sections/FeaturedPostsSection";
import { BlogsFilterAndGrid } from "./sections/BlogsFilterAndGrid";
import { BlogsSidebarSection } from "./sections/BlogsSidebarSection";
import { Container } from "@/components/common/Container";
import { CTA } from "@/components/common/CTA";
import { mergeBlogsPageConfig } from "@/config/blogsPage";
import { findPageSection } from "@/lib/cms/pageContent";

interface BlogsPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    page?: string;
    q?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const cmsConfig = await findPageSection("blogs.page");
  const cfg = mergeBlogsPageConfig(cmsConfig);
  const { cta } = cfg;

  const initialPage = params.page ? Math.max(1, parseInt(params.page, 10) || 1) : 1;

  return (
    <>
      <BlogsHeroSection config={cmsConfig ?? undefined} />
      <FeaturedPostsSection config={cmsConfig ?? undefined} />

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-8">
            <BlogsFilterAndGrid
              config={cfg}
              initialCategory={params.category}
              initialTag={params.tag}
              initialPage={initialPage}
              initialSearch={params.q}
              embedded
            />
          </div>
          <div className="lg:col-span-4">
            <BlogsSidebarSection
              config={cfg}
              initialCategory={params.category}
            />
          </div>
        </div>
      </Container>

      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
