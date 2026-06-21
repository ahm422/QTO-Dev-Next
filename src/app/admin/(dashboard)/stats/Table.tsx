"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteStat, reorderStats, toggleStatPublished } from "./actions"
import type { Stat } from "@prisma/client"
import { BarChart3 } from "lucide-react"

const columns: AdminTableColumn<Stat>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "label",
    label: "Stat",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{r.value}</p>
      </div>
    ),
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function StatsTable({ rows, canDelete }: { rows: Stat[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/stats"
      onDelete={deleteStat}
      onReorder={reorderStats}
      getItemName={(r) => r.label}
      emptyMessage="No stats yet."
      emptyIcon={BarChart3}
      emptyAction={{ label: "+ Add Stat", href: "/admin/stats/new" }}
      canDelete={canDelete}
    />
  )
}
