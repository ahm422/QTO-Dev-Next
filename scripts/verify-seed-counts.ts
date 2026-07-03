import "dotenv/config";
import { disconnect, initSeedPrisma, prisma } from "../prisma/seed/helpers";

async function main() {
  await initSeedPrisma();

  const counts = {
    services: await prisma.service.count(),
    processSteps: await prisma.processStep.count(),
    featuredWorks: await prisma.featuredWork.count(),
    whyChooseUs: await prisma.whyChooseUs.count(),
    stats: await prisma.stat.count(),
    testimonials: await prisma.testimonial.count(),
    industries: await prisma.industry.count(),
    engagementModels: await prisma.engagementModel.count(),
    faqs: await prisma.faq.count(),
    blogPosts: await prisma.blogPost.count(),
    technologies: await prisma.technology.count(),
    projects: await prisma.project.count(),
    workValues: await prisma.workValue.count(),
    aboutContent: await prisma.aboutContent.count(),
    teamMembers: await prisma.teamMember.count(),
    jobs: await prisma.job.count(),
    contactInfo: await prisma.contactInfo.count(),
    siteConfig: await prisma.siteConfig.count(),
    contacts: await prisma.contact.count(),
    requirements: await prisma.requirement.count(),
  };

  console.table(counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnect());
