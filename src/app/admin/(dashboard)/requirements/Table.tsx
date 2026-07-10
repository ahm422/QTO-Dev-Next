"use client";

import { useState } from "react";
import RequirementDetailSheet from "./DetailSheet";
import {
  displayOrDash,
  displayRequirementName,
  formatInboxDateShort,
} from "@/lib/admin/inboxDisplay";
import type { ParsedMetadata } from "@/lib/admin/inboxDisplay";

export type RequirementInboxRow = {
  id: string;
  intent: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  role: string | null;
  projectType: string | null;
  industry: string | null;
  companySize: string | null;
  goals: string | null;
  budgetRange: string | null;
  startDate: string | null;
  launchWindow: string | null;
  urgency: string | null;
  timeline: string | null;
  preferredTime: string | null;
  timezone: string | null;
  channel: string | null;
  features: string | null;
  integrations: string | null;
  successCriteria: string | null;
  message: string;
  source: string | null;
  referrer: string | null;
  userAgent: string | null;
  ip: string | null;
  metadata: ParsedMetadata;
  createdAt: Date;
};

function RequirementMobileCard({
  row,
  onSelect,
}: {
  row: RequirementInboxRow;
  onSelect: (row: RequirementInboxRow) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(row)}
      className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {displayRequirementName(row)}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {row.email}
          </p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {formatInboxDateShort(row.createdAt)}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {row.intent}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {displayOrDash(row.company)}
        </span>
      </div>
    </button>
  );
}

export default function RequirementsTable({
  rows,
}: {
  rows: RequirementInboxRow[];
}) {
  const [selected, setSelected] = useState<RequirementInboxRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openDetail(row: RequirementInboxRow) {
    setSelected(row);
    setSheetOpen(true);
  }

  function handleRowKeyDown(
    event: React.KeyboardEvent,
    row: RequirementInboxRow
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail(row);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="md:hidden space-y-2 p-3">
          {rows.map((row) => (
            <RequirementMobileCard key={row.id} row={row} onSelect={openDetail} />
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Company
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Intent
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Budget
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  tabIndex={0}
                  onClick={() => openDetail(row)}
                  onKeyDown={(event) => handleRowKeyDown(event, row)}
                  className="cursor-pointer hover:bg-muted/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {displayRequirementName(row)}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${row.email}`}
                      className="text-primary hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {displayOrDash(row.company)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {row.intent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {displayOrDash(row.budgetRange)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatInboxDateShort(row.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RequirementDetailSheet
        row={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
