import { BlogsHeroSection } from "./sections/BlogsHeroSection";
import { FeaturedPostsSection } from "./sections/FeaturedPostsSection";
import { BlogsFilterAndGrid } from "./sections/BlogsFilterAndGrid";
import { CTA } from "@/components/common/CTA";
import { mergeBlogsPageConfig } from "@/config/blogsPage";
import { findPageSection } from "@/lib/cms/pageContent";

interface BlogsPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    page?: string;
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
      <BlogsFilterAndGrid
        config={cfg}
        initialCategory={params.category}
        initialTag={params.tag}
        initialPage={initialPage}
      />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
