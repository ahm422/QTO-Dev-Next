export const pageBackgrounds = {
  "/services": "/images/service-bg.jpg",
  "/projects": "/images/projects-bg.jpg",
  "/about": "/images/about-bg.jpg",
  "/blogs": "/images/blog-bg.jpg",
  "/careers": "/images/career-bg.jpg",
  "/contact": "/images/contact-bg.jpg",
  "/requirements": "/images/contact-bg.jpg",
} as const;

export type PageBackgroundKey = keyof typeof pageBackgrounds;

export function getPageBackground(path: PageBackgroundKey): string {
  return pageBackgrounds[path];
}
