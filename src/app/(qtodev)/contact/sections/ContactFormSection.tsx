"use client";

import { ContactLayout } from "@/components/contact/ContactLayout";
import { ContactUsForm } from "@/components/contact/ContactUsForm";
import { TrustStripAnimated } from "@/components/marketing/TrustStripAnimated";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { MetricItem } from "@/components/marketing/TrustStripAnimated";

interface ContactFormSectionProps {
  metrics?: MetricItem[];
}

export function ContactFormSection({ metrics }: ContactFormSectionProps) {
  return (
    <ContactLayout
      id="contact-form"
      eyebrow="Contact"
      title="Send us a message"
      subtitle="Share a bit about what you’re building and where you need help. We’ll reply with practical next steps."
      size="xl"
      sideContent={
        <div className="space-y-6">
          <TrustStripAnimated metrics={metrics} orientation="column" />
          <div className="rounded-2xl border border-border bg-surface-muted/70 p-4 sm:p-5">
            <p className="text-sm font-semibold text-foreground">
              What happens next
            </p>
            <div className="mt-4 space-y-3 text-sm text-foreground-muted">
              {[
                "We reply within one business day.",
                "You’ll get a clear recommendation and next steps.",
                "If we’re not the right fit, we’ll point you in the right direction.",
              ].map((line) => (
                <div key={line} className="flex gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <AppIcon name="circle-check" size="sm" className="!text-[10px]" />
                  </span>
                  <p className="leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ContactUsForm source="contact-page" />
    </ContactLayout>
  );
}
