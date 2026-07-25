import { aboutPageConfig } from "@/config/aboutPage";
import { prisma } from "./helpers";

const constructQuestSeed = {
  slug: "construct-quest",
  title: "Construct Quest",
  subtitle: "CONSTRUCT QUEST",
  shortDescription: "Construction bidding & project intelligence platform",
  description:
    "Construct Quest connects GCs, subcontractors, suppliers, and manufacturers in one preconstruction workspace — find projects, estimate accurately, submit bids, and win more work.",
  statusLabel: "In development",
  titleHighlight: "Quest",
  order: 1,
  features: [
    {
      name: "Project Intelligence",
      description:
        "Searchable commercial projects with trade/location/phase filters, detail pages, and daily lead digests.",
      icon: "magnifying-glass",
    },
    {
      name: "Bid Board",
      description:
        "Free digital bid board: invitations, status tracking, due-date calendar, estimator assignment.",
      icon: "list",
    },
    {
      name: "Bid Solicitation",
      description:
        "GC tool to post projects, invite/prequalify subs, track responses, and distribute addenda.",
      icon: "plane",
    },
    {
      name: "Takeoff & Estimating",
      description:
        "Digital plan measurement, AI-assisted detection, collaboration, trade templates, Excel/PDF export.",
      icon: "layers",
    },
  ],
};

export async function seedProducts() {
  const erp = aboutPageConfig.erpSolutions;

  const products = [
    {
      slug: "erp-solutions",
      title: erp.title,
      subtitle: erp.subtitle,
      shortDescription: null as string | null,
      description: erp.body,
      statusLabel: null as string | null,
      titleHighlight: "Solutions",
      order: 0,
      features: erp.modules.map((m) => ({
        name: m.name,
        description: m.description,
        icon: null as string | null,
      })),
    },
    {
      ...constructQuestSeed,
      shortDescription: constructQuestSeed.shortDescription,
      statusLabel: constructQuestSeed.statusLabel,
      features: constructQuestSeed.features.map((f) => ({
        name: f.name,
        description: f.description,
        icon: f.icon,
      })),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        slug: product.slug,
        title: product.title,
        subtitle: product.subtitle,
        shortDescription: product.shortDescription,
        description: product.description,
        statusLabel: product.statusLabel,
        titleHighlight: product.titleHighlight,
        order: product.order,
        isPublished: true,
        features: {
          create: product.features.map((feature, sortOrder) => ({
            name: feature.name,
            description: feature.description,
            icon: feature.icon,
            sortOrder,
          })),
        },
      },
      update: {
        title: product.title,
        subtitle: product.subtitle,
        shortDescription: product.shortDescription,
        description: product.description,
        statusLabel: product.statusLabel,
        titleHighlight: product.titleHighlight,
        order: product.order,
        isPublished: true,
        features: {
          deleteMany: {},
          create: product.features.map((feature, sortOrder) => ({
            name: feature.name,
            description: feature.description,
            icon: feature.icon,
            sortOrder,
          })),
        },
      },
    });
  }
}
