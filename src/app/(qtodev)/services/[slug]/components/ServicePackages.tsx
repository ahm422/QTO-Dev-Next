"use client";

import { useState } from "react";
import Link from "next/link";
import { WebDevelopmentServiceData } from "@/content/services/web-development";

interface ServicePackagesProps {
  service: WebDevelopmentServiceData;
}

const serviceAreas = [
  "MVP Development",
  "SaaS Platforms",
  "E-commerce",
  "Enterprise Portals",
  "UI/UX Redesign",
  "Maintenance & Scaling",
];

const areaIcons = ["⚡", "☁️", "🛒", "🏢", "🎯", "📈"];

export function ServicePackages({ service }: ServicePackagesProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-14 md:py-20" aria-labelledby="service-packages-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="service-packages-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Our Web Development Service Packages
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {serviceAreas.map((area, idx) => (
            <div key={area} className="rounded-xl border border-border bg-surface p-4 text-center text-sm font-medium text-foreground-muted">
              <span className="mb-2 block text-xl" aria-hidden="true">{areaIcons[idx]}</span>
              {area}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-5 md:p-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {service.packages.map((pkg, idx) => (
              <button
                key={pkg.name}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`rounded-lg border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeTab === idx
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background text-foreground-muted hover:bg-surface-muted"
                }`}
                aria-label={`${pkg.name} package details`}
              >
                <p className="text-sm font-semibold">{pkg.name}</p>
                <p className="text-xs text-foreground-muted">{pkg.timeline}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface-muted p-5">
            <p className="text-sm font-semibold text-foreground">{service.packages[activeTab].name}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{service.packages[activeTab].price}</p>
            <p className="text-sm text-foreground-muted">Timeline: {service.packages[activeTab].timeline}</p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-foreground-muted">
              {service.packages[activeTab].features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-foreground-muted">
              <span className="font-semibold text-foreground">Ideal for:</span> {service.packages[activeTab].idealFor}
            </p>

            <Link
              href="/contact?intent=detailed-proposal"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Get Detailed Proposal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
