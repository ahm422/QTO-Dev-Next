"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteIndustry, reorderIndustries, toggleIndustryPublished } from "./actions"
import type { Industry } from "@prisma/client"

const columns: AdminTableColumn<Industry>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug", render: (r) => <code className="text-xs bg-muted px-1 py-0.5 rounded">{r.slug}</code> },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleIndustryPublished} /> },
]

export default function IndustriesTable({ rows }: { rows: Industry[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/industries"
      onDelete={deleteIndustry}
      onReorder={reorderIndustries}
      getItemName={(r) => r.name}
      emptyMessage="No industries yet."
    />
  )
}
