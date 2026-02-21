import { Project } from "@/content/projects/types";

interface ProblemSolutionProps {
  project: Project;
}

export function ProblemSolution({ project }: ProblemSolutionProps) {
  return (
    <section className="bg-surface py-12 md:py-16" aria-labelledby="problem-solution-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="problem-solution-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Problem → Solution
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-xl font-semibold text-foreground">The Challenge</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground-muted">
              {project.problem.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              <span className="font-semibold">Before:</span> Teams relied on fragmented tools and manual coordination.
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-xl font-semibold text-foreground">Our Solution</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground-muted">
              {project.solution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              <span className="font-semibold">After:</span> Workflows became measurable, auditable, and faster to execute.
            </p>
          </article>
        </div>

        {project.outcomes?.length ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold text-foreground">Outcomes</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground-muted">
              {project.outcomes.map((outcome) => (
                <li key={outcome} className="font-medium">{outcome}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
