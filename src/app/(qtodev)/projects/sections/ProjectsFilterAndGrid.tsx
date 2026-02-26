"use client";

import { useState, useMemo } from "react";
import { projects } from "@/data/projects";
import { projectsPageConfig } from "@/config/projectsPage";
import { ProjectsFilterSection } from "./ProjectsFilterSection";
import { ProjectsGridSection } from "./ProjectsGridSection";
import type { Project } from "@/types/project";

const allLabel = projectsPageConfig.filter.allLabel;

function getCategories(projectsList: Project[]): string[] {
  const uniques = [...new Set(projectsList.map((p) => p.category))].sort();
  return [allLabel, ...uniques];
}

export function ProjectsFilterAndGrid() {
  const [activeCategory, setActiveCategory] = useState<string>(allLabel);
  const categories = useMemo(() => getCategories(projects), []);
  const filteredProjects = useMemo(
    () =>
      activeCategory === allLabel
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <>
      <ProjectsFilterSection
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ProjectsGridSection projects={filteredProjects} />
    </>
  );
}
