import { prisma } from "@/lib/prisma";
import type { Service } from "@/types/service";
import { OurServicesSectionClient } from "./OurServicesSectionClient";
import { services as staticServices } from "@/data/services";

async function fetchServices(): Promise<Service[]> {
  try {
    const items = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });

    if (items.length === 0) return staticServices;

    return items.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      shortDescription: item.shortDescription,
      description: item.description,
      icon: item.icon,
      features: item.features,
      technologyTags: item.technologyTags,
      image: item.imageUrl ?? undefined,
      imageAlt: item.imageAlt ?? undefined,
    }));
  } catch {
    return staticServices;
  }
}

export async function OurServicesSection() {
  const services = await fetchServices();
  return <OurServicesSectionClient services={services} />;
}
