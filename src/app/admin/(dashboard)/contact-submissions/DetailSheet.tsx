"use client";

import {
  CollapsibleJson,
  DetailFieldList,
  DetailSection,
  MessageBlock,
} from "@/components/admin/inbox/DetailFieldList";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  buildTrackingFields,
} from "@/lib/admin/requirementDisplay";
import {
  displayContactName,
  displayContactSubject,
  formatInboxDate,
} from "@/lib/admin/inboxDisplay";
import type { ContactInboxRow } from "./Table";

type ContactDetailSheetProps = {
  row: ContactInboxRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContactDetailSheet({
  row,
  open,
  onOpenChange,
}: ContactDetailSheetProps) {
  if (!row) return null;

  const trackingFields = buildTrackingFields(row);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{displayContactName(row)}</SheetTitle>
          <SheetDescription>
            Received {formatInboxDate(row.createdAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <DetailSection title="Contact">
            <DetailFieldList
              fields={[
                { label: "Name", value: displayContactName(row) },
                { label: "Email", value: row.email },
                { label: "Subject", value: displayContactSubject(row) },
              ]}
            />
          </DetailSection>

          <DetailSection title="Message">
            <MessageBlock message={row.message} />
          </DetailSection>

          {trackingFields.length > 0 && (
            <DetailSection title="Tracking">
              <DetailFieldList fields={trackingFields} />
            </DetailSection>
          )}

          <CollapsibleJson data={row.metadata} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
