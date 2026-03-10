import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";
import { cn } from "@/components/theme/cn";

interface ContactLayoutProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  /** Optional container width override for different page layouts */
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function ContactLayout({
  eyebrow,
  title,
  subtitle,
  children,
  sideContent,
  size = "lg",
}: ContactLayoutProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-16 md:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[560px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-80 w-[420px] translate-x-1/4 rounded-full bg-primary/[0.03] blur-[110px]"
        aria-hidden
      />
      <Container size={size} className="relative">
        <div
          className={cn(
            "grid gap-10 md:gap-12 lg:gap-16",
            "lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:items-stretch"
          )}
        >
          <header className="space-y-4 lg:row-start-1 lg:col-start-1">
            {eyebrow ? (
              <p className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                {eyebrow}
              </p>
            ) : null}
            <div className="space-y-3">
              <Heading level={1} className="text-3xl sm:text-4xl md:text-5xl">
                {title}
              </Heading>
              {subtitle ? (
                <Text
                  size="lg"
                  color="muted"
                  className="max-w-2xl leading-relaxed"
                >
                  {subtitle}
                </Text>
              ) : null}
            </div>
          </header>

          <div
            className={cn(
              "rounded-2xl border border-border bg-gradient-to-b from-surface to-surface-muted/60 shadow-md shadow-black/5",
              "ring-1 ring-black/[0.03] dark:ring-white/[0.04]",
              "p-4 sm:p-6 md:p-7 lg:p-8",
              "lg:row-start-2 lg:col-start-1 lg:h-full lg:min-h-0"
            )}
          >
            {children}
          </div>

          {sideContent ? (
            <aside className="space-y-5 lg:space-y-6 lg:row-start-2 lg:col-start-2 lg:h-full lg:min-h-0">
              <div className="rounded-2xl border border-border/70 bg-surface/95 p-4 sm:p-5 shadow-md shadow-black/5 ring-1 ring-black/[0.03] dark:ring-white/[0.04] backdrop-blur h-full min-h-0">
                {sideContent}
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

