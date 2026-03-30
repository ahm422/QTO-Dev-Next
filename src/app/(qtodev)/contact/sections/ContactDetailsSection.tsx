import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

export function ContactDetailsSection() {
  const contactMethods = [
    {
      icon: "envelope" as const,
      title: "Email",
      description: "hello@qtodev.com",
      detail: "We'll respond within 24 hours",
      href: "mailto:hello@qtodev.com",
      external: false,
    },
    {
      icon: "phone" as const,
      title: "Phone",
      description: "+1 (555) 123-4567",
      detail: "Monday to Friday, 9am–5pm EST",
      href: "tel:+15551234567",
      external: false,
    },
    {
      icon: "location-dot" as const,
      title: "Office",
      description: "123 Tech Street, San Francisco, CA 94105",
      detail: "Visit us for a personal meeting",
      href: "https://maps.google.com/?q=123+Tech+Street+San+Francisco+CA+94105",
      external: true,
    },
  ];

  return (
    <section className="border-t border-border bg-muted/25 py-20 dark:bg-muted/10">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Other Ways to Reach Us
          </h2>
          <p className="mt-3 text-base text-foreground-muted md:text-lg">
            Prefer email, a call, or stopping by? Pick what works best — we’re
            here to help.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {contactMethods.map((method) => {
            const body = (
              <>
                <div
                  className={cn(
                    "mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                    "bg-primary/12 text-primary shadow-inner shadow-primary/5",
                    "ring-1 ring-primary/20 transition-[transform,background-color,box-shadow] duration-300",
                    "group-hover:bg-primary/18 group-hover:ring-primary/35"
                  )}
                  aria-hidden
                >
                  <AppIcon name={method.icon} size="lg" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {method.title}
                </p>
                <p className="mt-3 text-lg font-semibold leading-snug text-foreground">
                  {method.description}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                  {method.detail}
                </p>
              </>
            );

            return (
              <Card
                key={method.title}
                className={cn(
                  "group relative h-full gap-0 overflow-hidden border-border/80 p-8 py-8",
                  "bg-card/80 shadow-sm backdrop-blur-sm",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-1 hover:border-primary/40",
                  "hover:shadow-lg hover:shadow-primary/[0.07]",
                  "focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/20"
                )}
              >
                {method.href ? (
                  <a
                    href={method.href}
                    {...(method.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={cn(
                      "flex flex-col items-center text-center no-underline outline-none",
                      "after:absolute after:inset-0 after:rounded-xl after:content-['']"
                    )}
                  >
                    <span className="relative z-[1] flex flex-col items-center">
                      {body}
                    </span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    {body}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
