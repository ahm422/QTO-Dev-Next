"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import {
  FormSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ContactCTA() {
  const [projectType, setProjectType] = useState("");

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-background" aria-labelledby="contact-cta-heading">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/5 ring-1 ring-black/[0.03] md:p-10 lg:grid-cols-2 lg:gap-12"
            data-reveal
          >
            <div className="flex flex-col justify-center">
              <SectionHeader
                subtitle="Contact"
                subtitleClassName="text-primary font-semibold tracking-[0.2em]"
                subtitlePill
                title="Ready to build your next big thing?"
                description="Tell us what you are building and where you need help. Our team replies quickly with a practical plan."
                headingId="contact-cta-heading"
                centered={false}
              />
              <ul className="mt-6 space-y-3 text-sm text-foreground-muted">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  Fast reply and clear next steps
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  No long contracts required
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  Transparent pricing and delivery model
                </li>
              </ul>
            </div>

            <form
              className="rounded-2xl border border-border bg-surface-muted/80 p-6 shadow-inner ring-1 ring-black/[0.03] md:p-7"
              action="/api/contact"
              method="post"
            >
              <div className="grid grid-cols-1 gap-4">
                <input type="hidden" name="projectType" value={projectType} />
                <FormInput
                  label="Name"
                  name="name"
                  required
                  className="mt-1.5"
                />
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  required
                  className="mt-1.5"
                />
                <FormInput
                  label="Company"
                  name="company"
                  className="mt-1.5"
                />
                <FormSelect
                  label="Project type"
                  value={projectType}
                  onValueChange={setProjectType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mvp">MVP Development</SelectItem>
                    <SelectItem value="saas">SaaS Platform</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="enterprise">Enterprise Portal</SelectItem>
                    <SelectItem value="redesign">UI/UX Redesign</SelectItem>
                    <SelectItem value="maintenance">Maintenance &amp; Scaling</SelectItem>
                  </SelectContent>
                </FormSelect>

                <FormTextarea
                  label="Message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1.5"
                />

                <Button
                  type="submit"
                  className="mt-2 min-h-[44px] w-full sm:w-auto sm:min-h-0 sm:px-6 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Send message – we reply in &lt;24h
                </Button>

                <p className="text-center text-xs text-foreground-muted">
                  Or{" "}
                  <Link
                    href="/book-a-call"
                    className="font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted rounded"
                  >
                    book 15-min call instead →
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
