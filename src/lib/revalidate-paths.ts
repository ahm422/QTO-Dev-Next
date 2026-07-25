/** Public paths to revalidate after CMS mutations (issue #189 matrix). */

export const REVALIDATE_HOME = ["/"] as const;
export const REVALIDATE_SERVICES = ["/", "/services", "/sitemap.xml"] as const;
export const REVALIDATE_BLOGS = ["/", "/blogs", "/sitemap.xml"] as const;
export const REVALIDATE_PROJECTS = ["/", "/projects", "/sitemap.xml"] as const;
export const REVALIDATE_PRODUCTS = ["/products"] as const;
export const REVALIDATE_ABOUT = ["/about"] as const;
export const REVALIDATE_CAREERS = ["/careers"] as const;
export const REVALIDATE_CONTACT = ["/contact"] as const;
export const REVALIDATE_FAQS = ["/faqs"] as const;

/** Page sections affect the specific public page they belong to. */
export function pageSectionPaths(slug: string): string[] {
  const page = slug.split(".")[0];
  const map: Record<string, string[]> = {
    homepage: ["/"],
    services: ["/services"],
    about: ["/about"],
    blogs: ["/blogs"],
    careers: ["/careers"],
    projects: ["/projects"],
    contact: ["/contact"],
    faqs: ["/faqs"],
  };
  return map[page] ?? ["/"];
}

export function servicePaths(slug?: string | null) {
  return [
    ...REVALIDATE_SERVICES,
    ...(slug ? [`/services/${slug}`] : []),
  ];
}

export function blogPaths(slug?: string | null) {
  return [
    ...REVALIDATE_BLOGS,
    ...(slug ? [`/blogs/${slug}`] : []),
  ];
}

export function projectPaths(slug?: string | null) {
  return [
    ...REVALIDATE_PROJECTS,
    ...(slug ? [`/projects/${slug}`] : []),
  ];
}

export function productPaths(_slug?: string | null) {
  return [...REVALIDATE_PRODUCTS];
}
