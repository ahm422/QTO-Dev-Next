/** Public paths to revalidate after CMS mutations (issue #189 matrix). */

export const REVALIDATE_HOME = ["/"] as const;
export const REVALIDATE_SERVICES = ["/", "/services", "/sitemap.xml"] as const;
export const REVALIDATE_BLOGS = ["/", "/blogs", "/sitemap.xml"] as const;
export const REVALIDATE_PROJECTS = ["/", "/projects", "/sitemap.xml"] as const;
export const REVALIDATE_ABOUT = ["/about"] as const;
export const REVALIDATE_CAREERS = ["/careers"] as const;
export const REVALIDATE_CONTACT = ["/contact"] as const;

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
