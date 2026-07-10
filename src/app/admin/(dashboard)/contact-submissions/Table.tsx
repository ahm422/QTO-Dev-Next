"use client";

import { useState } from "react";
import ContactDetailSheet from "./DetailSheet";
import {
  displayContactName,
  displayContactSubject,
  formatInboxDateShort,
} from "@/lib/admin/inboxDisplay";
import type { ParsedMetadata } from "@/lib/admin/inboxDisplay";

export type ContactInboxRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string | null;
  referrer: string | null;
  userAgent: string | null;
  ip: string | null;
  metadata: ParsedMetadata;
  createdAt: Date;
};

function ContactMobileCard({
  row,
  onSelect,
}: {
  row: ContactInboxRow;
  onSelect: (row: ContactInboxRow) => void;
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
            {displayContactName(row)}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {row.email}
          </p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {formatInboxDateShort(row.createdAt)}
        </span>
      </div>
      <p className="text-sm text-foreground mt-2 truncate">
        {displayContactSubject(row)}
      </p>
    </button>
  );
}

export default function ContactSubmissionsTable({
  rows,
}: {
  rows: ContactInboxRow[];
}) {
  const [selected, setSelected] = useState<ContactInboxRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openDetail(row: ContactInboxRow) {
    setSelected(row);
    setSheetOpen(true);
  }

  function handleRowKeyDown(
    event: React.KeyboardEvent,
    row: ContactInboxRow
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
            <ContactMobileCard key={row.id} row={row} onSelect={openDetail} />
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
                  Subject
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Received
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
                    {displayContactName(row)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <a
                      href={`mailto:${row.email}`}
                      className="text-primary hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-foreground max-w-xs truncate">
                    {displayContactSubject(row)}
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

      <ContactDetailSheet
        row={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
