import { revalidatePath, revalidateTag } from "next/cache";
import { blogPaths, productPaths, projectPaths, servicePaths } from "@/lib/revalidate-paths";

export function revalidatePaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

/** Path + tag invalidation for public blog CMS reads (`tags: ["blog"]`). */
export function revalidateBlogCaches(slug?: string | null) {
  revalidatePaths([...blogPaths(slug)]);
  revalidateTag("blog", "max");
}

/** Path + tag invalidation for public service CMS reads (`tags: ["services"]`). */
export function revalidateServiceCaches(slug?: string | null) {
  revalidatePaths([...servicePaths(slug)]);
  revalidateTag("services", "max");
}

/** Path + tag invalidation for public project CMS reads (`tags: ["projects"]`). */
export function revalidateProjectCaches(
  projectSlug?: string | null,
  ...serviceSlugs: (string | null | undefined)[]
) {
  const paths = [...projectPaths(projectSlug)];
  for (const slug of serviceSlugs) {
    if (slug) paths.push(...servicePaths(slug));
  }
  revalidatePaths(paths);
  revalidateTag("projects", "max");
}

/** Path + tag invalidation for public team / founder CMS reads (`tags: ["team"]`). */
export function revalidateTeamCaches() {
  revalidatePaths(["/", "/about"]);
  revalidateTag("team", "max");
}

/** Path + tag invalidation for public products CMS reads (`tags: ["products"]`). */
export function revalidateProductsCaches() {
  revalidatePaths([...productPaths()]);
  revalidateTag("products", "max");
}
