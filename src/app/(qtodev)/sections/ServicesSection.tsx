import Link from "next/link";
import { findPublishedServices } from "@/lib/cms/services";
import { Container } from "@/components/common/Container";

export async function ServicesSection() {
  const services = await findPublishedServices();
  if (services.length === 0) return null;

  return (
    <section className="py-16">
      <Container>
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <li key={service.id}>
              <Link href={`/services/${service.slug}`} className="text-primary hover:underline">
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
