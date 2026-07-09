"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import { ProjectsFilterBarSection } from "./ProjectsFilterBarSection";
import { ProjectsGridSection } from "./ProjectsGridSection";
import type { Project } from "@/types/project";

const allLabel = projectsPageConfig.filter.allLabel;

function getCategories(projects: Project[]): string[] {
  const uniques = [...new Set(projects.map((p) => p.category))].sort();
  return [allLabel, ...uniques];
}

function resolveCategory(initialCategory: string | undefined, projects: Project[]): string {
  if (!initialCategory) return allLabel;
  const categories = getCategories(projects);
  return categories.includes(initialCategory) ? initialCategory : allLabel;
}

interface ProjectsFilterAndGridClientProps {
  projects: Project[];
  config?: ProjectsPageConfigType;
  initialCategory?: string;
}

export function ProjectsFilterAndGridClient({
  projects,
  config,
  initialCategory,
}: ProjectsFilterAndGridClientProps) {
  const cfg = config ?? projectsPageConfig;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string>(() =>
    resolveCategory(initialCategory, projects)
  );

  const categories = useMemo(() => getCategories(projects), [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === allLabel) return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory, projects]);

  const updateUrl = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (category && category !== allLabel) {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      const query = params.toString();
      router.replace(query ? `/projects?${query}` : "/projects", { scroll: false });
    },
    [router, searchParams]
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    updateUrl(category);
  };

  const handleClearFilters = () => {
    setActiveCategory(allLabel);
    updateUrl(allLabel);
  };

  return (
    <>
      <ProjectsFilterBarSection
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        config={cfg}
      />
      <ProjectsGridSection
        projects={filteredProjects}
        config={cfg}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}
