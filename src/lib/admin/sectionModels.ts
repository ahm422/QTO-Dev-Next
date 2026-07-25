import { prisma } from "@/lib/prisma"
import type { PrismaModelName } from "@/config/content-sections"

/**
 * Minimal shape needed for dashboard aggregation: count() with an optional
 * isPublished filter. Using an explicit map (rather than prisma[string])
 * keeps model resolution type-safe — an unknown/typo'd name fails to compile.
 */
type CountableDelegate = {
  // Method shorthand (bivariant params) + a permissive `where` so delegates
  // whose input lacks `isPublished` (e.g. SiteConfig) remain assignable. The
  // `Record<PrismaModelName>` map below still fails on unknown/typo'd names.
  count(args?: { where?: Record<string, unknown> }): Promise<number>
}

export const modelDelegates: Record<PrismaModelName, CountableDelegate> = {
  Service: prisma.service,
  Product: prisma.product,
  ProcessStep: prisma.processStep,
  FeaturedWork: prisma.featuredWork,
  WhyChooseUs: prisma.whyChooseUs,
  Stat: prisma.stat,
  Testimonial: prisma.testimonial,
  Industry: prisma.industry,
  EngagementModel: prisma.engagementModel,
  Faq: prisma.faq,
  BlogPost: prisma.blogPost,
  Technology: prisma.technology,
  Project: prisma.project,
  WorkValue: prisma.workValue,
  AboutContent: prisma.aboutContent,
  TeamMember: prisma.teamMember,
  Job: prisma.job,
  ContactInfo: prisma.contactInfo,
  PageSection: prisma.pageSection,
  SiteConfig: prisma.siteConfig,
}

/**
 * Minimal shape for activity-chart aggregation: pull just `createdAt` for
 * records inside a time window, then bucket by month in JS. Only models with
 * `hasTimestamps: true` (i.e. a `createdAt` column) belong in the map below.
 */
type TimeSeriesDelegate = {
  findMany(args: {
    where?: { createdAt?: { gte?: Date; lt?: Date } }
    select: { createdAt: true }
  }): Promise<{ createdAt: Date }[]>
}

/**
 * Time-series-capable delegates, keyed by model name. Partial because
 * timestamp-less settings/singleton models (AboutContent, ContactInfo,
 * PageSection, SiteConfig) are intentionally excluded — they aren't chartable.
 */
export const timeSeriesDelegates: Partial<Record<PrismaModelName, TimeSeriesDelegate>> = {
  Service: prisma.service,
  Product: prisma.product,
  ProcessStep: prisma.processStep,
  FeaturedWork: prisma.featuredWork,
  WhyChooseUs: prisma.whyChooseUs,
  Stat: prisma.stat,
  Testimonial: prisma.testimonial,
  Industry: prisma.industry,
  EngagementModel: prisma.engagementModel,
  Faq: prisma.faq,
  BlogPost: prisma.blogPost,
  Technology: prisma.technology,
  Project: prisma.project,
  WorkValue: prisma.workValue,
  TeamMember: prisma.teamMember,
  Job: prisma.job,
}
