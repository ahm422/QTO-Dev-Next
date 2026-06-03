"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteTechnology, reorderTechnologies, toggleTechnologyPublished } from "./actions"
import type { Technology } from "@prisma/client"

const columns: AdminTableColumn<Technology>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "name", label: "Name" },
  { key: "iconKey", label: "Icon key" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleTechnologyPublished} /> },
]

export default function TechnologiesTable({ rows }: { rows: Technology[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/technologies"
      onDelete={deleteTechnology}
      onReorder={reorderTechnologies}
      getItemName={(r) => r.name}
      emptyMessage="No technologies yet."
    />
  )
}
