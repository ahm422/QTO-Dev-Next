import Link from "next/link";
import { Text } from "@/components/ui/shared/Text";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="text-primary hover:text-primary-hover transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <Text color="muted" size="sm">
                {item.label}
              </Text>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-foreground-muted">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
