import { revalidatePath, revalidateTag } from "next/cache";
import { blogPaths } from "@/lib/revalidate-paths";

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

/** Path + tag invalidation for public team / founder CMS reads (`tags: ["team"]`). */
export function revalidateTeamCaches() {
  revalidatePaths(["/", "/about"]);
  revalidateTag("team", "max");
}
