import { jobs } from "@/data/jobs";
import { prisma, upsertBy } from "./helpers";

export async function seedJobs() {
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const location = `${job.location} (${job.workMode})`;
    await upsertBy(
      () =>
        prisma.job.findFirst({
          where: { title: job.title, department: job.department },
        }),
      () =>
        prisma.job.create({
          data: {
            title: job.title,
            department: job.department,
            location,
            type: job.employmentType,
            description: job.description,
            requirements: job.requirements,
            niceToHave: job.tags,
            salaryRange: job.compensationNote ?? null,
            applyUrl: job.applyUrl,
            order: i,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.job.update({
          where: { id: existing.id },
          data: {
            location,
            type: job.employmentType,
            description: job.description,
            requirements: job.requirements,
            niceToHave: job.tags,
            salaryRange: job.compensationNote ?? null,
            applyUrl: job.applyUrl,
            order: i,
            isPublished: true,
          },
        })
    );
  }
}
