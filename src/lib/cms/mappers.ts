import type {
  AboutContent,
  ContactInfo,
  EngagementModel as PrismaEngagementModel,
  Faq as PrismaFaq,
  FeaturedWork,
  Industry,
  Job as PrismaJob,
  ProcessStep,
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
import type { Product } from "@/types/product";
import type { Service, WorkProcessStep } from "@/types/service";
import type { StatsNumbersItem, StatsNumbersVariant } from "@/types/statsNumbers";
import type { TestimonialItem } from "@/types/testimonials";
import type { WhyChooseUsItem } from "@/types/whyChooseUs";
import type { LeadershipMember } from "@/types/leadership";
import type { BlogPostWithTags } from "@/lib/prisma/blogPostData";
import type { ProductWithFeatures } from "@/lib/prisma/productData";
import type { ProjectWithRelations } from "@/lib/prisma/projectData";
import type { ServiceWithTags } from "@/lib/prisma/serviceData";
import { orderedTagValues, parseStringArray } from "@/lib/prisma/arrayFields";
import { parseMetadata } from "@/lib/metadata";
import { defaultSiteBranding } from "@/config/site";
import { resolveMediaUrl, resolveMediaUrlOrEmpty } from "@/config/staticImages";
import { SOCIAL_LINKS } from "@/lib/constants";

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

export function mapService(row: ServiceWithTags): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    icon: row.icon,
    features: parseStringArray(row.features),
    technologyTags: orderedTagValues(row.technologyTags),
    image: resolveMediaUrl(row.imageUrl),
    imageAlt: row.imageAlt ?? undefined,
  };
}

export function mapProduct(row: ProductWithFeatures): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    shortDescription: row.shortDescription ?? undefined,
    description: row.description,
    statusLabel: row.statusLabel ?? undefined,
    titleHighlight: row.titleHighlight ?? undefined,
    image: resolveMediaUrl(row.imageUrl),
    imageAlt: row.imageAlt ?? undefined,
    order: row.order,
    features: row.features.map((f) => ({
      name: f.name,
      description: f.description,
      icon: f.icon ?? undefined,
    })),
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
  const tags = parseStringArray(row.tags);
  const slug =
    row.link?.replace(/^\/projects\//, "").replace(/^\//, "") ?? row.id;
  const caseNumber = String(row.order || index + 1).padStart(2, "0");
  return {
    id: row.id,
    caseNumber,
    title: row.title,
    category: tags[0] ?? "PROJECT",
    description: row.description,
    slug,
    image: resolveMediaUrlOrEmpty(row.imageUrl),
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
    avatar: resolveMediaUrl(row.avatarUrl),
    mediaType,
    mediaUrl: resolveMediaUrl(row.mediaUrl),
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
    features: parseStringArray(row.features),
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

export function mapBlogPost(row: BlogPostWithTags): BlogPost {
  const rawDate = row.publishedAt ?? row.createdAt;
  const iso = rawDate.toISOString().slice(0, 10);
  const publishedAt = Number.isNaN(new Date(iso).getTime())
    ? row.createdAt.toISOString().slice(0, 10)
    : iso;
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
    tags: orderedTagValues(row.tags),
    image: resolveMediaUrl(row.imageUrl),
    coverImage: row.imageUrl
      ? { url: resolveMediaUrlOrEmpty(row.imageUrl), alt: row.imageAlt ?? row.title }
      : undefined,
    readingTime: Number.isFinite(row.readTime) ? row.readTime! : 5,
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

export function mapProject(row: ProjectWithRelations): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    shortDescription: row.excerpt,
    image: resolveMediaUrl(row.coverImageUrl),
    featured: row.isFeatured,
    category: row.category,
    tags: orderedTagValues(row.tags),
    technologies: orderedTagValues(row.techStack),
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
  const niceToHave = parseStringArray(row.niceToHave);
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.type,
    applyUrl: row.applyUrl ?? undefined,
    description: row.description,
    requirements: parseStringArray(row.requirements),
    tags: niceToHave.length > 0 ? niceToHave : undefined,
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
    imageUrl: resolveMediaUrl(row.avatarUrl),
    bio: row.bio ?? undefined,
  };
}

export function mapProjectToPortfolioCase(
  row: ProjectWithRelations,
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
    image: resolveMediaUrl(row.coverImageUrl),
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
  const heroMeta = parseMetadata<{
    founded?: number;
    team?: number;
    clients?: number;
    projects?: number;
  }>(bySection.hero?.metadata);
  const valuesMeta = parseMetadata<{
    values?: { title: string; description: string }[];
  }>(bySection.values?.metadata);

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

export interface ErpModule {
  name: string;
  description: string;
}

export interface ErpSolutionsContent {
  title: string;
  subtitle: string;
  body: string;
  modules: ErpModule[];
  industries: string[];
  legacyModernization: {
    title: string;
    body: string;
  };
}

export function mapErpSolutionsContent(
  row: AboutContent | undefined,
  fallback: ErpSolutionsContent
): ErpSolutionsContent {
  if (!row) return fallback;

  const meta = parseMetadata<{
    modules?: ErpModule[];
    industries?: string[];
    legacyModernization?: { title: string; body: string };
  }>(row.metadata);

  return {
    title: row.title ?? fallback.title,
    subtitle: row.subtitle ?? fallback.subtitle,
    body: row.body ?? fallback.body,
    modules: meta?.modules?.length ? meta.modules : fallback.modules,
    industries: meta?.industries?.length ? meta.industries : fallback.industries,
    legacyModernization: meta?.legacyModernization ?? fallback.legacyModernization,
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
    social: [
      { label: "Facebook", href: map["social.facebook"] ?? SOCIAL_LINKS.facebook },
      { label: "Instagram", href: map["social.instagram"] ?? SOCIAL_LINKS.instagram },
      { label: "LinkedIn", href: map["social.linkedin"] ?? SOCIAL_LINKS.linkedin },
    ].filter((s) => Boolean(s.href)),
  };
}
