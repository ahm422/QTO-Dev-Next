"use client";

import { Button } from "@/components/ui/shared/Button";
import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";

interface CTAProps {
  title: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function CTA({
  title,
  description,
  primaryButtonText = "Get Started",
  primaryButtonHref = "/contact",
  secondaryButtonText,
  secondaryButtonHref,
}: CTAProps) {
  return (
    <section className="bg-primary py-16">
      <div className="max-w-4xl mx-auto px-4 text-center text-primary-foreground">
        <Heading level={2} className="text-primary-foreground mb-4">
          {title}
        </Heading>
        {description && <Text size="lg" className="text-primary-foreground/90 mb-8">{description}</Text>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => window.location.href = primaryButtonHref}>
            {primaryButtonText}
          </Button>
          {secondaryButtonText && (
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-hover"
              onClick={() => window.location.href = secondaryButtonHref || "#"}
            >
              {secondaryButtonText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
