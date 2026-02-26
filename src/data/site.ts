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
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blogs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#documentation" },
      { label: "API Reference", href: "#api" },
      { label: "FAQs", href: "#faqs" },
      { label: "Insights", href: "#insights" },
      { label: "Let's Partner Up", href: "#partner-up" },
      { label: "Let's Build Something Real", href: "#build-something-real" },
      { label: "Support", href: "#support" },
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
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

export const siteConfig = {
  name: "QTO Dev",
  description: "Premium web development and design services",
  url: "https://qtodev.com",
  ogImage: "https://qtodev.com/og/default.png",
  mainNav: navItems,
  footerNav: footerSections,
  socials: socialLinks,
};
