"use client";

import { useState, useCallback, useEffect } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { partnerUpConfig } from "@/config/partnerUp";
import type { TestimonialItem } from "@/types/testimonials";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "partner-up-heading";

function goPrev(index: number, total: number) {
  return index <= 0 ? total - 1 : index - 1;
}

function goNext(index: number, total: number) {
  return index >= total - 1 ? 0 : index + 1;
}

const cardClass =
  "rounded-2xl shadow-md bg-background/95 border border-border p-6 sm:p-8 md:p-8";

export function PartnerUpSectionClient({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem: TestimonialItem | undefined = items[activeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => goPrev(i, items.length));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => goNext(i, items.length));
  }, [items.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section
      id="partner-up"
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-gradient-to-b from-surface via-surface-muted/50 to-surface",
        "border-y border-border/80"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs */}
      <div
        className="pointer-events-none absolute top-1/4 -left-40 w-80 h-80 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left column: header, testimonial card, contact block */}
            <div className="flex flex-col gap-8" data-reveal>
              <SectionHeader
                subtitle={partnerUpConfig.subtitle}
                subtitleClassName="text-primary font-semibold"
                subtitlePill
                title={partnerUpConfig.title}
                titleHighlight={partnerUpConfig.titleHighlight}
                headingId={HEADING_ID}
                centered={false}
              />

            {items.length > 0 && (
              <div className={cn(
                cardClass,
                "rounded-2xl shadow-lg shadow-black/5 border-primary/10 hover:border-primary/20 transition-colors"
              )}>
                <div
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Partner testimonials"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0"
                      aria-hidden
                    >
                      <span className="text-primary font-bold text-xl">
                        {activeItem?.authorName?.charAt(0) ?? "?"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">
                        {activeItem?.authorName}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        {activeItem?.authorTitle}, {activeItem?.company}
                      </p>
                    </div>
                  </div>
                  <blockquote
                    className="text-foreground text-base sm:text-lg leading-relaxed mb-6 font-medium"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    &ldquo;{activeItem?.quote}&rdquo;
                  </blockquote>

                  {items.length > 1 && (
                    <div
                      className="flex items-center gap-3 pt-4 border-t border-border"
                      role="group"
                      aria-label="Carousel navigation"
                    >
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                        aria-label="Previous testimonial"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <div className="flex items-center gap-2">
                        {items.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                              "w-3 h-3 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                              i === activeIndex
                                ? "bg-primary scale-110"
                                : "bg-foreground-muted/40 hover:bg-foreground-muted/60"
                            )}
                            aria-label={`Slide ${i + 1}`}
                            aria-current={i === activeIndex ? "true" : undefined}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                        aria-label="Next testimonial"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact block */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
              <div className="flex items-start gap-4 rounded-xl border border-border/80 bg-background/80 p-4 sm:p-5 shadow-sm w-full sm:w-auto sm:min-w-[200px]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <AppIcon name="location-dot" size="sm" />
                </div>
                <div className="text-sm text-foreground-muted min-w-0">
                  <p className="font-semibold text-foreground">
                    {partnerUpConfig.locationLine1}
                  </p>
                  <p>{partnerUpConfig.locationLine2}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/80 p-4 sm:p-5 shadow-sm w-full sm:w-auto sm:min-w-[200px]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <AppIcon name="phone" size="sm" />
                </div>
                <a
                  href={`tel:${partnerUpConfig.phone.replace(/\s/g, "")}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                >
                  {partnerUpConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/80 p-4 sm:p-5 shadow-sm w-full sm:w-auto sm:min-w-[200px]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <AppIcon name="envelope" size="sm" />
                </div>
                <a
                  href={`mailto:${partnerUpConfig.email}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors text-sm break-all"
                >
                  {partnerUpConfig.email}
                </a>
              </div>
            </div>
            </div>

            {/* Right column: form card */}
            <div data-reveal>
              <PartnerUpForm />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function PartnerUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    requiresNda: false,
    notBot: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          requiresNda: formData.requiresNda,
          notBot: formData.notBot,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          requiresNda: false,
          notBot: false,
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn(
      cardClass,
      "relative overflow-hidden rounded-2xl border-primary/10 shadow-lg shadow-black/5",
      "ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
    )}>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-primary/30" aria-hidden />
      <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-semibold block mb-4">
        {partnerUpConfig.introLine}
      </span>
      <ul className="space-y-3 mb-6" role="list">
        <li className="flex items-center gap-3 text-foreground text-sm">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
            <AppIcon name="check" size="sm" />
          </span>
          {partnerUpConfig.bullet1}
        </li>
        <li className="flex items-center gap-3 text-foreground text-sm">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
            <AppIcon name="check" size="sm" />
          </span>
          {partnerUpConfig.bullet2}
        </li>
      </ul>

      <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
        {partnerUpConfig.formTitle}
      </h3>

      {submitted ? (
        <div className="rounded-2xl bg-success/15 border border-success/40 p-8 text-center shadow-inner">
          <p className="text-success font-semibold text-lg">
            Thank you for reaching out! We&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput
              label={partnerUpConfig.nameLabel}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={partnerUpConfig.namePlaceholder}
              required
            />
            <FormInput
              label={partnerUpConfig.emailLabel}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={partnerUpConfig.emailPlaceholder}
              required
            />
          </div>

          <FormInput
            label={partnerUpConfig.phoneLabel}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={partnerUpConfig.phonePlaceholder}
          />

          <FormTextarea
            label={partnerUpConfig.messageLabel}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={partnerUpConfig.messagePlaceholder}
            rows={5}
            required
          />

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground-muted">
              <input
                type="checkbox"
                name="requiresNda"
                checked={formData.requiresNda}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
              />
              {partnerUpConfig.ndaLabel}
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground-muted">
              <input
                type="checkbox"
                name="notBot"
                checked={formData.notBot}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
              />
              {partnerUpConfig.notBotLabel}
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {partnerUpConfig.submitLabel}
            <AppIcon name="arrow-right" size="sm" className="ml-2" />
          </Button>
        </form>
      )}
    </div>
  );
}
