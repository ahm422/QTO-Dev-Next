import { laheboProject } from "./example";
import { Project } from "./types";
import { prisma } from "@/lib/prisma";
import { mapPrismaToContentProject } from "@/lib/cms/mapContentProject";

async function fetchDbProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return rows.map((row) => mapPrismaToContentProject(row, rows));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (slug === laheboProject.slug) {
    return laheboProject;
  }
  const row = await prisma.project.findFirst({
    where: { slug, isPublished: true },
  });
  if (!row) return null;
  const all = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return mapPrismaToContentProject(row, all);
}

export async function getAllProjects(): Promise<Project[]> {
  const dbProjects = await fetchDbProjects();
  const laheboInDb = dbProjects.some((p) => p.slug === laheboProject.slug);
  return laheboInDb ? dbProjects : [laheboProject, ...dbProjects];
}
