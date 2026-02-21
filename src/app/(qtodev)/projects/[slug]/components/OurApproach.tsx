import { Project } from "@/content/projects/types";

interface OurApproachProps {
  project: Project;
}

export function OurApproach({ project }: OurApproachProps) {
  if (!project.approach) return null;

  return (
    <section className="bg-surface py-12 md:py-16" aria-labelledby="our-approach-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="our-approach-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          {project.approach.title || "Our Approach"}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold text-foreground">Delivery Steps</h3>
            <ol className="mt-4 space-y-3 text-sm text-foreground-muted">
              {project.approach.steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {project.approach.challenges?.length ? (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-lg font-semibold text-foreground">Challenges & Solutions</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-foreground-muted">
                {project.approach.challenges.map((challenge) => (
                  <li key={challenge}>{challenge}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
