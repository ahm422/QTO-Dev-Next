"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteProcessStep, reorderProcessSteps, toggleProcessStepPublished } from "./actions"
import type { ProcessStep } from "@prisma/client"
import { GitBranch } from "lucide-react"

const columns: AdminTableColumn<ProcessStep>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  { key: "context", label: "Context", render: (r) => <CategoryBadge category={r.context} /> },
  { key: "stepNumber", label: "Step", render: (r) => <span className="text-xs font-mono text-muted-foreground">{r.stepNumber}</span> },
  { key: "title", label: "Title", render: (r) => <span className="text-sm font-medium text-foreground">{r.title}</span> },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function ProcessStepsTable({ rows, canDelete }: { rows: ProcessStep[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/process-steps"
      onDelete={deleteProcessStep}
      onReorder={reorderProcessSteps}
      getItemName={(r) => r.title}
      emptyMessage="No process steps yet."
      emptyIcon={GitBranch}
      emptyAction={{ label: "+ Add Step", href: "/admin/process-steps/new" }}
      canDelete={canDelete}
    />
  )
}
