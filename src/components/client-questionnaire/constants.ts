import type { z } from "zod";
import {
  brandingMaterialSchema,
  pageOptionSchema,
  serviceOptionSchema,
} from "@/lib/validators/clientQuestionnaire";

export type ServiceValue = z.infer<typeof serviceOptionSchema>;
export type PageValue = z.infer<typeof pageOptionSchema>;
export type BrandingValue = z.infer<typeof brandingMaterialSchema>;

export const SERVICE_CHOICES: { value: ServiceValue; label: string }[] = [
  {
    value: "website-design-development",
    label: "Website Design & Development",
  },
  { value: "logo-design", label: "Logo Design" },
  { value: "full-branding-kit", label: "Full Branding Kit" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "seo-digital-marketing", label: "SEO & Digital Marketing" },
  {
    value: "custom-portal-dashboard",
    label: "Custom Project Portal or Dashboard",
  },
  { value: "other", label: "Other Services" },
];

export const PAGE_CHOICES: { value: PageValue; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "services", label: "Services" },
  { value: "projects", label: "Projects" },
  { value: "portfolios", label: "Portfolios" },
  { value: "testimonials", label: "Testimonials" },
  { value: "contact", label: "Contact Us" },
  { value: "careers", label: "Careers" },
  { value: "faq", label: "FAQ's" },
  { value: "blogs", label: "Blogs" },
  { value: "other", label: "Others" },
];

export const BRANDING_CHOICES: { value: BrandingValue; label: string }[] = [
  { value: "business-card", label: "Business Card" },
  { value: "letterhead", label: "Letterhead" },
  { value: "social-kit", label: "Social Media Kit" },
  { value: "brand-guidelines", label: "Brand Guidelines" },
];

export const QUESTIONNAIRE_STEPS = [
  { id: "basic", label: "Basic information" },
  { id: "services", label: "Services" },
  { id: "website", label: "Website" },
  { id: "branding", label: "Logo & branding" },
  { id: "business", label: "Your business" },
  { id: "files", label: "Uploads" },
  { id: "platform", label: "Platform note" },
] as const;
