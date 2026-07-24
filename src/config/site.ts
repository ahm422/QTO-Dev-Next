/** Static site chrome (nav/footer structure). Dynamic copy comes from CMS site_config. */

import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  OFFICE_ADDRESS,
  SOCIAL_LINKS,
} from "@/lib/constants";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blogs" },
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/about" },
];

export const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blogs" },
      { label: "Get a Quote", href: "/requirements" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Insights", href: "/blogs" },
      { label: "Let's Build Something Real", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export const socialLinks = [
  { label: "Twitter", href: SOCIAL_LINKS.twitter },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { label: "GitHub", href: SOCIAL_LINKS.github },
  { label: "Facebook", href: SOCIAL_LINKS.facebook },
  { label: "Instagram", href: SOCIAL_LINKS.instagram },
];

export const defaultSiteBranding = {
  name: "QTO Dev",
  description: "Premium web development and design services",
  url: "https://qtodev.com",
  ogImage: "https://qtodev.com/og/default.png",
  contact: {
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
    office: OFFICE_ADDRESS,
  },
} as const;
