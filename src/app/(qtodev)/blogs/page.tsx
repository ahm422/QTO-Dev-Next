import { BlogsHeroSection } from "./sections/BlogsHeroSection";
import { FeaturedPostsSection } from "./sections/FeaturedPostsSection";
import { BlogsFilterAndGrid } from "./sections/BlogsFilterAndGrid";
import { BlogPaginationSection } from "./sections/BlogPaginationSection";
import { CTA } from "@/components/common/CTA";
import { blogsPageConfig } from "@/config/blogsPage";
import { findPageSection } from "@/lib/cms/pageContent";

export default async function BlogsPage() {
  const cmsConfig = await findPageSection("blogs.page") as typeof blogsPageConfig | null;
  const cfg = cmsConfig ?? blogsPageConfig;
  const { cta } = cfg;
  return (
    <>
      <BlogsHeroSection config={cmsConfig ?? undefined} />
      <FeaturedPostsSection />
      <BlogsFilterAndGrid />
      <BlogPaginationSection config={cmsConfig ?? undefined} />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
