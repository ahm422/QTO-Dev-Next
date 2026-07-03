import { disconnect, initSeedPrisma, resolveSeedD1Target } from "./seed/helpers";
import { seedAboutContent } from "./seed/aboutContent";
import { seedPageSections } from "./seed/pageSections";
import { seedBlogPosts } from "./seed/blogPosts";
import { seedContactInfo } from "./seed/contactInfo";
import { seedEngagementModels } from "./seed/engagementModels";
import { seedFaqs } from "./seed/faqs";
import { seedFeaturedWork } from "./seed/featuredWork";
import { seedIndustries } from "./seed/industries";
import { seedJobs } from "./seed/jobs";
import { seedProcessSteps } from "./seed/processSteps";
import { seedProjects } from "./seed/projects";
import { seedServices } from "./seed/services";
import { seedSiteConfig } from "./seed/siteConfig";
import { seedStats } from "./seed/stats";
import { seedTeamMembers } from "./seed/teamMembers";
import { seedTechnologies } from "./seed/technologies";
import { seedTestimonials } from "./seed/testimonials";
import { seedWhyChooseUs } from "./seed/whyChooseUs";
import { seedWorkValues } from "./seed/workValues";

async function main() {
  const target = resolveSeedD1Target();
  await initSeedPrisma(target);
  console.log(`Seeding CMS content into ${target} D1 from static data…`);

  await seedServices();
  await seedProcessSteps();
  await seedFeaturedWork();
  await seedWhyChooseUs();
  await seedStats();
  await seedTestimonials();
  await seedIndustries();
  await seedEngagementModels();
  await seedFaqs();
  await seedBlogPosts();
  await seedTechnologies();
  await seedProjects();
  await seedWorkValues();
  await seedAboutContent();
  await seedTeamMembers();
  await seedJobs();
  await seedContactInfo();
  await seedSiteConfig();
  await seedPageSections();

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnect());
