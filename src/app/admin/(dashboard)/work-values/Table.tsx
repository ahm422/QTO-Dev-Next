"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteWorkValue, reorderWorkValues, toggleWorkValuePublished } from "./actions"
import type { WorkValue } from "@prisma/client"
import { Heart } from "lucide-react"

const columns: AdminTableColumn<WorkValue>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "title",
    label: "Value",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.title}</p>
        {r.icon && <p className="text-xs text-muted-foreground font-mono mt-0.5">{r.icon}</p>}
      </div>
    ),
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function WorkValuesTable({ rows, canDelete }: { rows: WorkValue[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/work-values"
      onDelete={deleteWorkValue}
      onReorder={reorderWorkValues}
      getItemName={(r) => r.title}
      emptyMessage="No work values yet."
      emptyIcon={Heart}
      emptyAction={{ label: "+ Add Value", href: "/admin/work-values/new" }}
      canDelete={canDelete}
    />
  )
}
