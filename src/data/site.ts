/** Seed wrapper — do not duplicate nav/footer/social here. */

export {
  defaultSiteBranding,
  footerSections,
  navItems,
  socialLinks,
} from "@/config/site";
import {
  defaultSiteBranding,
  footerSections,
  navItems,
  socialLinks,
} from "@/config/site";

export const siteConfig = {
  name: defaultSiteBranding.name,
  description: defaultSiteBranding.description,
  url: defaultSiteBranding.url,
  ogImage: defaultSiteBranding.ogImage,
  mainNav: navItems,
  footerNav: footerSections,
  socials: socialLinks,
};
