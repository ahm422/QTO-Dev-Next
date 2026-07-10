"use client";

import { useState } from "react";
import type { DisplayField } from "@/lib/admin/requirementDisplay";

export function DetailFieldList({
  fields,
  emptyMessage = "No details available.",
}: {
  fields: DisplayField[];
  emptyMessage?: string;
}) {
  if (fields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <dl className="grid gap-3">
      {fields.map((field) => (
        <div key={field.label} className="grid gap-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {field.label}
          </dt>
          <dd className="text-sm text-foreground whitespace-pre-wrap break-words">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

export function MessageBlock({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
        {message}
      </p>
    </div>
  );
}

export function CollapsibleJson({
  title = "Raw metadata",
  data,
}: {
  title?: string;
  data: unknown;
}) {
  const [open, setOpen] = useState(false);

  if (data == null) {
    return null;
  }

  const obj =
    typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;

  if (!obj || Object.keys(obj).length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {open ? "▾" : "▸"} {title}
      </button>
      {open && (
        <pre className="max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap break-all">
          {JSON.stringify(obj, null, 2)}
        </pre>
      )}
    </div>
  );
}
