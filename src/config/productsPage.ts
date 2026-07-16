/**
 * Products page copy and section-level strings (issue #320).
 * Construct Quest marketing content from docs/construct-quest-brd.md (§1, §6.1).
 * Status: Draft / In development — do not claim GA.
 */

export const productsPageConfig = {
  hero: {
    badge: "Products",
    heading: "Software products built for real work",
    subhead:
      "ERP platforms that unify operations, and Construct Quest — a construction bidding & project intelligence platform in development.",
    ctaText: "Explore Construct Quest",
    ctaHref: "#construct-quest",
    breadcrumbLabel: "Products",
  },
  constructQuest: {
    subtitle: "CONSTRUCT QUEST",
    title: "Construct Quest",
    titleHighlight: "Quest",
    tagline: "Construction bidding & project intelligence platform",
    body: "Construct Quest connects GCs, subcontractors, suppliers, and manufacturers in one preconstruction workspace — find projects, estimate accurately, submit bids, and win more work.",
    statusLabel: "In development",
    modules: [
      {
        name: "Project Intelligence",
        description:
          "Searchable commercial projects with trade/location/phase filters, detail pages, and daily lead digests.",
      },
      {
        name: "Bid Board",
        description:
          "Free digital bid board: invitations, status tracking, due-date calendar, estimator assignment.",
      },
      {
        name: "Bid Solicitation",
        description:
          "GC tool to post projects, invite/prequalify subs, track responses, and distribute addenda.",
      },
      {
        name: "Takeoff & Estimating",
        description:
          "Digital plan measurement, AI-assisted detection, collaboration, trade templates, Excel/PDF export.",
      },
    ],
  },
  cta: {
    title: "Interested in these products? Let's talk",
    description:
      "Whether you need enterprise ERP or want early access to Construct Quest, we'd love to hear from you.",
    primaryButtonText: "Get In Touch",
    primaryButtonHref: "/contact",
  },
} as const;
