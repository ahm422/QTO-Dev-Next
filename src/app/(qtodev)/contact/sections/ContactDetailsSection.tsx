import { Container } from "@/components/common/Container";
import { ContactMethodCard } from "@/components/contact/ContactMethodCard";
import { findPublishedContactInfo } from "@/lib/cms/contactInfo";

export async function ContactDetailsSection() {
  const contactMethods = await findPublishedContactInfo();
  if (contactMethods.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/25 py-12 md:py-14 dark:bg-muted/10">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Other Ways to Reach Us
          </h2>
          <p className="mt-3 text-base text-foreground-muted md:text-lg">
            Prefer email, a call, or stopping by? Pick what works best — we’re
            here to help.
          </p>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-3 md:gap-5">
          {contactMethods.map((method) => (
            <ContactMethodCard
              key={method.title}
              icon={method.icon}
              title={method.title}
              description={method.description}
              detail={method.detail}
              href={method.href}
              external={method.external}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
