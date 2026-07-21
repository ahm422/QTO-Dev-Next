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
