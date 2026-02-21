import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";

interface SectionHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  description,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      {subtitle && (
        <Text size="sm" color="muted" className="uppercase tracking-wide mb-2">
          {subtitle}
        </Text>
      )}
      <Heading level={2} className="mb-4">
        {title}
      </Heading>
      {description && (
        <Text size="lg" color="muted" className="max-w-2xl mx-auto">
          {description}
        </Text>
      )}
    </div>
  );
}
