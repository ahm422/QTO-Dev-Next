import { BlogsHeroSection } from "./sections/BlogsHeroSection";
import { FeaturedPostsSection } from "./sections/FeaturedPostsSection";
import { BlogFilterBarSection } from "./sections/BlogFilterBarSection";
import { BlogGridSection } from "./sections/BlogGridSection";
import { BlogPaginationSection } from "./sections/BlogPaginationSection";

export default function BlogsPage() {
  return (
    <>
      <BlogsHeroSection />
      <FeaturedPostsSection />
      <BlogFilterBarSection />
      <BlogGridSection />
      <BlogPaginationSection />
    </>
  );
}
