import { servicesProcessSteps } from "@/data/servicesProcess";
import { homeProcessSteps } from "./data/homeProcessSteps";
import { prisma, upsertBy } from "./helpers";

async function seedContextSteps(
  context: string,
  steps: { order: number; title: string; description: string; icon?: string }[]
) {
  for (const step of steps) {
    await upsertBy(
      () =>
        prisma.processStep.findFirst({
          where: { context, stepNumber: step.order },
        }),
      () =>
        prisma.processStep.create({
          data: {
            context,
            stepNumber: step.order,
            title: step.title,
            description: step.description,
            icon: step.icon ?? "gear",
            order: step.order,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.processStep.update({
          where: { id: existing.id },
          data: {
            title: step.title,
            description: step.description,
            icon: step.icon ?? "gear",
            order: step.order,
            isPublished: true,
          },
        })
    );
  }
}

export async function seedProcessSteps() {
  await seedContextSteps("homepage", homeProcessSteps);
  await seedContextSteps("services", servicesProcessSteps);
}
