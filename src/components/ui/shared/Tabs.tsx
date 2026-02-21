"use client";

import { useState } from "react";
import { cn } from "@/components/theme/cn";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ items, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  return (
    <div className={className}>
      <div className="flex border-b border-border">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 font-medium text-sm transition-colors duration-200",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-foreground-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {items.map((tab) =>
          activeTab === tab.id ? (
            <div key={tab.id}>{tab.content}</div>
          ) : null
        )}
      </div>
    </div>
  );
}
