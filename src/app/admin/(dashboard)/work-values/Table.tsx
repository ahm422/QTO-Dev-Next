"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteWorkValue, reorderWorkValues, toggleWorkValuePublished } from "./actions"
import type { WorkValue } from "@prisma/client"

const columns: AdminTableColumn<WorkValue>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "title", label: "Title" },
  { key: "icon", label: "Icon" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleWorkValuePublished} /> },
]

export default function WorkValuesTable({ rows }: { rows: WorkValue[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/work-values"
      onDelete={deleteWorkValue}
      onReorder={reorderWorkValues}
      getItemName={(r) => r.title}
      emptyMessage="No work values yet."
    />
  )
}
