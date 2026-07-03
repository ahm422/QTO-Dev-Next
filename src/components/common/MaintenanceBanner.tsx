"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function MaintenanceBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="status"
      className="relative z-50 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-950 dark:text-amber-100"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 pr-8">
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        <p>
          Scheduled maintenance in progress. Forms and admin edits are temporarily unavailable.
          Public pages remain readable.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-amber-500/20"
        aria-label="Dismiss maintenance notice"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
