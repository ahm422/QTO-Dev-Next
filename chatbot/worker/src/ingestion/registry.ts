import type { SourceDefinition } from "../types/document.js";
import { servicesSource } from "./sources/services.js";
import { productsSource } from "./sources/products.js";
import { projectsSource } from "./sources/projects.js";
import { blogPostsSource } from "./sources/blogPosts.js";
import { industriesSource } from "./sources/industries.js";
import { aboutContentSource } from "./sources/aboutContent.js";
import { teamMembersSource } from "./sources/teamMembers.js";
import { testimonialsSource } from "./sources/testimonials.js";
import { engagementModelsSource } from "./sources/engagementModels.js";
import { faqsSource } from "./sources/faqs.js";
import { chatbotFaqsSource } from "./sources/chatbotFaqs.js";
import { technologiesSource } from "./sources/technologies.js";
import { processStepsSource } from "./sources/processSteps.js";
import { jobsSource } from "./sources/jobs.js";

/**
 * Every RAG source the chatbot is allowed to read, and nothing else.
 *
 * This is an explicit allowlist, not a generic "read any table" mechanism —
 * there is no code path anywhere in this package that can query `contacts`,
 * `requirements`, `job_applications`, `admin_users`, `refresh_tokens`,
 * `password_reset_tokens`, `audit_logs`, `site_config`, or `page_sections`.
 * Extending the chatbot's knowledge to a new table means adding a new
 * `SourceDefinition` here deliberately, not flipping a config flag.
 */
export const SOURCE_REGISTRY: SourceDefinition[] = [
  servicesSource,
  productsSource,
  projectsSource,
  blogPostsSource,
  industriesSource,
  aboutContentSource,
  teamMembersSource,
  testimonialsSource,
  engagementModelsSource,
  faqsSource,
  chatbotFaqsSource,
  technologiesSource,
  processStepsSource,
  jobsSource,
];
