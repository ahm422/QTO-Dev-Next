import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { findPublishedContactInfo } from "@/lib/cms/contactInfo";

export async function ContactDetailsSection() {
  const contactMethods = await findPublishedContactInfo();
  if (contactMethods.length === 0) return null;

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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <AppIcon name={method.icon} size="lg" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {method.title}
                </h3>
                <p className="mt-2 text-base font-medium text-foreground">
                  {method.description}
                </p>
                <p className="mt-1 text-sm text-foreground-muted">{method.detail}</p>
              </>
            );

            const cardClass = cn(
              "flex h-full flex-col rounded-2xl border border-border bg-surface p-6 md:p-8",
              "shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            );

            if (method.href) {
              return (
                <a
                  key={method.title}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  className={cn(cardClass, "group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary")}
                >
                  <Card className="h-full border-0 bg-transparent p-0 shadow-none">{body}</Card>
                </a>
              );
            }

            return (
              <Card key={method.title} className={cardClass}>
                {body}
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
