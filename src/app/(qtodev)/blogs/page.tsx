import { BlogsHeroSection } from "./sections/BlogsHeroSection";
import { FeaturedPostsSection } from "./sections/FeaturedPostsSection";
import { BlogsFilterAndGrid } from "./sections/BlogsFilterAndGrid";
import { BlogPaginationSection } from "./sections/BlogPaginationSection";
import { CTA } from "@/components/common/CTA";
import { blogsPageConfig } from "@/config/blogsPage";

export default function BlogsPage() {
  const { cta } = blogsPageConfig;
  return (
    <>
      <BlogsHeroSection />
      <FeaturedPostsSection />
      <BlogsFilterAndGrid />
      <BlogPaginationSection />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
