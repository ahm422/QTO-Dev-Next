import { AppIcon } from '@/components/ui/shared/AppIcon';

interface KeyTakeawaysProps {
  takeaways: string[];
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  return (
    <section className="my-8 p-6 bg-primary/10 border-l-4 border-primary rounded-r-lg">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <AppIcon name="lightbulb" size="sm" className="text-primary" />
        Key Takeaways
      </h3>
      <ul className="space-y-3">
        {takeaways.map((takeaway, index) => (
          <li
            key={index}
            className="flex gap-3 text-foreground-muted"
          >
            <span className="font-bold text-primary flex-shrink-0">•</span>
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
