import { staticImageUrl } from "@/config/staticImages";

export const pageBackgrounds = {
  "/services": staticImageUrl("/images/service-bg.jpg"),
  "/projects": staticImageUrl("/images/projects-bg.jpg"),
  "/about": staticImageUrl("/images/about-bg.jpg"),
  "/products": staticImageUrl("/images/about-bg.jpg"),
  "/blogs": staticImageUrl("/images/blog-bg.jpg"),
  "/careers": staticImageUrl("/images/career-bg.jpg"),
  "/contact": staticImageUrl("/images/contact-bg.jpg"),
  "/requirements": staticImageUrl("/images/contact-bg.jpg"),
} as const;

export type PageBackgroundKey = keyof typeof pageBackgrounds;

export function getPageBackground(path: PageBackgroundKey): string {
  return pageBackgrounds[path];
}
