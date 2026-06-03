import type {
  AboutContent,
  BlogPost as PrismaBlogPost,
  ContactInfo,
  EngagementModel as PrismaEngagementModel,
  Faq as PrismaFaq,
  FeaturedWork,
  Industry,
  Job as PrismaJob,
  ProcessStep,
  Project as PrismaProject,
  Service as PrismaService,
  SiteConfig,
  Stat,
  TeamMember,
  Technology,
  Testimonial,
  WhyChooseUs,
  WorkValue,
} from "@prisma/client";
import type { BlogPost } from "@/types/blog";
import type { EngagementModel } from "@/types/engagementModel";
import type { Faq } from "@/types/faq";
import type { FeaturedWorkItem } from "@/types/featuredWork";
import type { IndustryItem, IndustryIconKey } from "@/types/industry";
import type { Job } from "@/types/job";
import type { PortfolioCase, PortfolioGradientKey } from "@/types/portfolio";
import type { Project } from "@/types/project";
import type { Service, WorkProcessStep } from "@/types/service";
import type { StatsNumbersItem, StatsNumbersVariant } from "@/types/statsNumbers";
import type { TestimonialItem } from "@/types/testimonials";
import type { WhyChooseUsItem } from "@/types/whyChooseUs";
import type { LeadershipMember } from "@/types/leadership";
import { defaultSiteBranding } from "@/config/site";

const PORTFOLIO_GRADIENTS: PortfolioGradientKey[] = [
  "blue-purple",
  "grey",
  "dark",
  "orange",
  "green",
  "red",
];

const INDUSTRY_ICONS: IndustryIconKey[] = [
  "building",
  "heart",
  "cart",
  "plane",
  "monitor",
  "rocket",
  "globe",
  "chart",
];

export function mapService(row: PrismaService): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    icon: row.icon,
    features: row.features,
    technologyTags: row.technologyTags,
    image: row.imageUrl ?? undefined,
    imageAlt: row.imageAlt ?? undefined,
  };
}

export function mapProcessStep(row: ProcessStep): WorkProcessStep {
  return {
    order: row.stepNumber,
    title: row.title,
    description: row.description,
    icon: row.icon,
  };
}

export function mapFeaturedWork(row: FeaturedWork, index: number): FeaturedWorkItem {
  const slug =
    row.link?.replace(/^\/projects\//, "").replace(/^\//, "") ?? row.id;
  const caseNumber = String(row.order || index + 1).padStart(2, "0");
  return {
    id: row.id,
    caseNumber,
    title: row.title,
    category: row.tags[0] ?? "PROJECT",
    description: row.description,
    slug,
    image: row.imageUrl ?? "",
    order: row.order,
  };
}

export function mapWhyChooseUs(row: WhyChooseUs): WhyChooseUsItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    label: row.icon ?? undefined,
  };
}

export function mapStat(row: Stat): StatsNumbersItem {
  const variant = (row.color as StatsNumbersVariant | null) ?? "default";
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    description: row.description ?? "",
    variant: ["default", "gold", "dark"].includes(variant) ? variant : "default",
  };
}

export function mapTestimonial(row: Testimonial): TestimonialItem {
  const mediaType = ["none", "image", "video"].includes(row.mediaType)
    ? (row.mediaType as TestimonialItem["mediaType"])
    : "none";

  return {
    id: row.id,
    quote: row.quote,
    authorName: row.clientName,
    authorTitle: row.clientRole,
    company: row.clientCompany,
    avatar: row.avatarUrl ?? undefined,
    mediaType,
    mediaUrl: row.mediaUrl ?? undefined,
    mediaAlt: row.mediaAlt ?? undefined,
  };
}

export function mapIndustry(row: Industry, index: number): IndustryItem {
  const icon =
    (row.icon as IndustryIconKey | null) ??
    INDUSTRY_ICONS[index % INDUSTRY_ICONS.length];
  return {
    id: row.id,
    title: row.name,
    number: String(row.order || index + 1).padStart(2, "0") + ".",
    description: row.description ?? "",
    icon,
  };
}

export function mapEngagementModel(row: PrismaEngagementModel): EngagementModel {
  return {
    optionNumber: `OPTION ${row.number}`,
    title: row.title,
    description: row.description,
    features: row.features,
    isPopular: row.isMostPopular,
    getStartedHref: row.ctaLink,
  };
}

export function mapFaq(row: PrismaFaq): Faq {
  return {
    question: row.question,
    answer: row.answer,
  };
}

export function mapBlogPost(row: PrismaBlogPost): BlogPost {
  const publishedAt = row.publishedAt?.toISOString().slice(0, 10) ?? row.createdAt.toISOString().slice(0, 10);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.excerpt,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    publishedAt,
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
    featured: row.isFeatured,
    category: row.category,
    tags: row.tags,
    image: row.imageUrl ?? undefined,
    coverImage: row.imageUrl
      ? { url: row.imageUrl, alt: row.imageAlt ?? row.title }
      : undefined,
    readingTime: row.readTime ?? 5,
  };
}

export function mapTechnology(row: Technology) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    iconKey: row.iconKey,
  };
}

export function mapProject(row: PrismaProject): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    shortDescription: row.excerpt,
    image: row.coverImageUrl ?? undefined,
    featured: row.isFeatured,
    category: row.category,
    tags: row.tags,
    technologies: row.techStack,
    link: row.liveUrl ?? undefined,
    caseStudy: Boolean(row.challenge || row.solution),
  };
}

export function mapWorkValue(row: WorkValue) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon ?? undefined,
  };
}

export function mapJob(row: PrismaJob): Job {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.type,
    applyUrl: row.applyUrl ?? "#",
    description: row.description,
    requirements: row.requirements,
    tags: row.niceToHave.length > 0 ? row.niceToHave : undefined,
    postedLabel: row.postedAt
      ? `Posted ${row.postedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
      : undefined,
  };
}

export function mapContactMethod(row: ContactInfo) {
  const href =
    row.type === "email"
      ? `mailto:${row.value}`
      : row.type === "phone"
        ? `tel:${row.value.replace(/\D/g, "")}`
        : row.type === "office"
          ? `https://maps.google.com/?q=${encodeURIComponent(row.value)}`
          : row.value;
  return {
    icon: (row.icon ?? "envelope") as "envelope" | "phone" | "location-dot",
    title: row.label,
    description: row.value,
    detail: row.subLabel ?? "",
    href,
    external: row.type === "office",
  };
}

export function mapTeamMember(row: TeamMember): LeadershipMember {
  return {
    id: row.id,
    name: row.name,
    designation: row.role,
    imageUrl: row.avatarUrl ?? undefined,
    bio: row.bio ?? undefined,
  };
}

export function mapProjectToPortfolioCase(
  row: PrismaProject,
  index: number
): PortfolioCase {
  const initial = (row.client ?? row.title).charAt(0).toUpperCase();
  return {
    caseNumber: String(index + 1).padStart(2, "0"),
    companyName: row.client ?? row.title,
    industry: row.category.toUpperCase(),
    initial,
    gradient: PORTFOLIO_GRADIENTS[index % PORTFOLIO_GRADIENTS.length],
    slug: row.slug,
    image: row.coverImageUrl ?? undefined,
    imageAlt: row.title,
  };
}

export interface AboutPageContent {
  mission: string;
  vision: string;
  values: { title: string; description: string }[];
  company: {
    name: string;
    founded: number;
    team: number;
    clients: number;
    projects: number;
  };
}

export function buildAboutPageContent(
  sections: AboutContent[]
): AboutPageContent | null {
  if (sections.length === 0) return null;
  const bySection = Object.fromEntries(sections.map((s) => [s.section, s]));
  const heroMeta = bySection.hero?.metadata as
    | { founded?: number; team?: number; clients?: number; projects?: number }
    | null
    | undefined;
  const valuesMeta = bySection.values?.metadata as
    | { values?: { title: string; description: string }[] }
    | null
    | undefined;

  return {
    mission: bySection.mission?.body ?? "",
    vision: bySection.vision?.body ?? "",
    values: valuesMeta?.values ?? [],
    company: {
      name: bySection.hero?.title ?? defaultSiteBranding.name,
      founded: heroMeta?.founded ?? 2015,
      team: heroMeta?.team ?? 0,
      clients: heroMeta?.clients ?? 0,
      projects: heroMeta?.projects ?? 0,
    },
  };
}

export function mapSiteConfigRows(rows: SiteConfig[]) {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    name: map["site.name"] ?? defaultSiteBranding.name,
    description: map["site.description"] ?? defaultSiteBranding.description,
    url: map["site.url"] ?? defaultSiteBranding.url,
    ogImage: map["site.ogImage"] ?? defaultSiteBranding.ogImage,
    contact: {
      email: map["contact.email"] ?? defaultSiteBranding.contact.email,
      phone: map["contact.phone"] ?? defaultSiteBranding.contact.phone,
      office: map["contact.office"] ?? defaultSiteBranding.contact.office,
    },
  };
}
