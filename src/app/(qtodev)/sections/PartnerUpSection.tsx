"use client";

import { useState, useCallback, useEffect } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Input } from "@/components/ui/shared/Input";
import { Button } from "@/components/ui/shared/Button";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { partnerUpConfig } from "@/config/partnerUp";
import { testimonialsItems } from "@/data/testimonials";
import { cn } from "@/components/theme/cn";
import type { TestimonialItem } from "@/types/testimonials";

const HEADING_ID = "partner-up-heading";

function goPrev(index: number, total: number) {
  return index <= 0 ? total - 1 : index - 1;
}

function goNext(index: number, total: number) {
  return index >= total - 1 ? 0 : index + 1;
}

const cardClass =
  "rounded-xl shadow-sm bg-background border border-border p-6 md:p-8";

export function PartnerUpSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = testimonialsItems;
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
      className="py-16 md:py-20 bg-[#FBF6EA] dark:bg-[#1a1914]"
      aria-labelledby={HEADING_ID}
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column: header, testimonial card, contact block */}
          <div className="flex flex-col gap-6">
            <SectionHeader
              subtitle={partnerUpConfig.subtitle}
              subtitleClassName="text-primary"
              title={partnerUpConfig.title}
              titleHighlight={partnerUpConfig.titleHighlight}
              headingId={HEADING_ID}
              centered={false}
            />

            {items.length > 0 && (
              <div className={cardClass}>
                <div
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Partner testimonials"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                      aria-hidden
                    >
                      <span className="text-primary font-semibold text-lg">
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
                    className="text-foreground text-base leading-relaxed mb-6"
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
                        className="p-2 rounded-full bg-surface-muted text-foreground-muted hover:text-foreground hover:bg-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
                              "w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                              i === activeIndex
                                ? "bg-primary"
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
                        className="p-2 rounded-full bg-surface-muted text-foreground-muted hover:text-foreground hover:bg-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6 text-foreground-muted text-sm">
              <div className="flex items-start gap-3">
                <AppIcon name="location-dot" size="sm" className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    {partnerUpConfig.locationLine1}
                  </p>
                  <p>{partnerUpConfig.locationLine2}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AppIcon name="phone" size="sm" className="text-primary shrink-0" />
                <a
                  href={`tel:${partnerUpConfig.phone.replace(/\s/g, "")}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {partnerUpConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <AppIcon name="envelope" size="sm" className="text-primary shrink-0" />
                <a
                  href={`mailto:${partnerUpConfig.email}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {partnerUpConfig.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right column: form card */}
          <PartnerUpForm />
        </div>
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
    <div className={cardClass}>
      <span className="text-sm uppercase tracking-wide text-primary font-medium block mb-4">
        {partnerUpConfig.introLine}
      </span>
      <ul className="space-y-2 mb-6" role="list">
        <li className="flex items-center gap-2 text-foreground text-sm">
          <AppIcon name="check" size="sm" className="text-primary shrink-0" />
          {partnerUpConfig.bullet1}
        </li>
        <li className="flex items-center gap-2 text-foreground text-sm">
          <AppIcon name="check" size="sm" className="text-primary shrink-0" />
          {partnerUpConfig.bullet2}
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mb-6">
        {partnerUpConfig.formTitle}
      </h3>

      {submitted ? (
        <div className="bg-success/15 border border-success rounded-lg p-6 text-center">
          <p className="text-success font-semibold">
            Thank you for reaching out! We&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label={partnerUpConfig.nameLabel}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={partnerUpConfig.namePlaceholder}
              required
            />
            <Input
              label={partnerUpConfig.emailLabel}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={partnerUpConfig.emailPlaceholder}
              required
            />
          </div>

          <Input
            label={partnerUpConfig.phoneLabel}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={partnerUpConfig.phonePlaceholder}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {partnerUpConfig.messageLabel}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={partnerUpConfig.messagePlaceholder}
              rows={5}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

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
            variant="primary"
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
