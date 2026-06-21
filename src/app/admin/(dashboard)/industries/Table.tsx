"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteIndustry, reorderIndustries, toggleIndustryPublished } from "./actions"
import type { Industry } from "@prisma/client"
import { Building2 } from "lucide-react"

const columns: AdminTableColumn<Industry>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "name",
    label: "Industry",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.name}</p>
        <code className="text-xs text-muted-foreground font-mono mt-0.5 block">{r.slug}</code>
      </div>
    ),
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function IndustriesTable({ rows, canDelete }: { rows: Industry[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/industries"
      onDelete={deleteIndustry}
      onReorder={reorderIndustries}
      getItemName={(r) => r.name}
      emptyMessage="No industries yet."
      emptyIcon={Building2}
      emptyAction={{ label: "+ Add Industry", href: "/admin/industries/new" }}
      canDelete={canDelete}
    />
  )
}
