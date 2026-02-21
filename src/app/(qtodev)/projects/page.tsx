import { ProjectsHeroSection } from "./sections/ProjectsHeroSection";
import { ProjectsFilterSection } from "./sections/ProjectsFilterSection";
import { ProjectsGridSection } from "./sections/ProjectsGridSection";
import { ProjectsPaginationSection } from "./sections/ProjectsPaginationSection";
import { CTA } from "@/components/common/CTA";

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHeroSection />
      <ProjectsFilterSection />
      <ProjectsGridSection />
      <ProjectsPaginationSection />
      <CTA
        title="Want to See More?"
        description="Check out our latest case studies and project insights"
        primaryButtonText="Contact Us"
        primaryButtonHref="/contact"
      />
    </>
  );
}
