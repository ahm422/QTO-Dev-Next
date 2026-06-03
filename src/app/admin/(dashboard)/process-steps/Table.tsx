"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { Badge } from "@/components/ui/badge"
import { deleteProcessStep, reorderProcessSteps, toggleProcessStepPublished } from "./actions"
import type { ProcessStep } from "@prisma/client"

const columns: AdminTableColumn<ProcessStep>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "context", label: "Context", render: (r) => <Badge variant="outline">{r.context}</Badge> },
  { key: "stepNumber", label: "Step" },
  { key: "title", label: "Title" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleProcessStepPublished} /> },
]

export default function ProcessStepsTable({ rows }: { rows: ProcessStep[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/process-steps"
      onDelete={deleteProcessStep}
      onReorder={reorderProcessSteps}
      getItemName={(r) => r.title}
      emptyMessage="No process steps yet."
    />
  )
}
