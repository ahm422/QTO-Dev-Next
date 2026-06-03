"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteStat, toggleStatPublished } from "./actions"
import type { Stat } from "@prisma/client"

const columns: AdminTableColumn<Stat>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "label", label: "Label" },
  { key: "value", label: "Value" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleStatPublished} /> },
]

export default function StatsTable({ rows }: { rows: Stat[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/stats"
      onDelete={deleteStat}
      getItemName={(r) => r.label}
      emptyMessage="No stats yet."
    />
  )
}
