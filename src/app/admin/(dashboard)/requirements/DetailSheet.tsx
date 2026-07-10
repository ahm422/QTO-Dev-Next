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
  formatQuestionnaireForDisplay,
  getQuestionnaireFromMetadata,
} from "@/lib/admin/formatQuestionnaireForDisplay";
import {
  displayRequirementName,
  formatInboxDate,
} from "@/lib/admin/inboxDisplay";
import {
  buildRequirementContactFields,
  buildRequirementProjectFields,
  buildTrackingFields,
} from "@/lib/admin/requirementDisplay";
import type { RequirementInboxRow } from "./Table";

type RequirementDetailSheetProps = {
  row: RequirementInboxRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RequirementDetailSheet({
  row,
  open,
  onOpenChange,
}: RequirementDetailSheetProps) {
  if (!row) return null;

  const questionnaire = getQuestionnaireFromMetadata(row.metadata);
  const questionnaireFields = questionnaire
    ? formatQuestionnaireForDisplay(questionnaire)
    : [];
  const trackingFields = buildTrackingFields(row);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{displayRequirementName(row)}</SheetTitle>
          <SheetDescription>
            Submitted {formatInboxDate(row.createdAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <DetailSection title="Contact">
            <DetailFieldList
              fields={buildRequirementContactFields({
                ...row,
                name: displayRequirementName(row),
              })}
            />
          </DetailSection>

          <DetailSection title="Project details">
            <DetailFieldList fields={buildRequirementProjectFields(row)} />
          </DetailSection>

          <DetailSection title="Message">
            <MessageBlock message={row.message} />
          </DetailSection>

          {questionnaireFields.length > 0 && (
            <DetailSection title="Questionnaire">
              <DetailFieldList fields={questionnaireFields} />
            </DetailSection>
          )}

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
