"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteEngagementModel, reorderEngagementModels, toggleEngagementModelPublished } from "./actions"
import type { EngagementModel } from "@prisma/client"
import { Layers } from "lucide-react"

const columns: AdminTableColumn<EngagementModel>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "title",
    label: "Model",
    render: (r) => <p className="text-sm font-medium text-foreground">{r.title}</p>,
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function EngagementModelsTable({ rows, canDelete }: { rows: EngagementModel[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/engagement-models"
      onDelete={deleteEngagementModel}
      onReorder={reorderEngagementModels}
      getItemName={(r) => r.title}
      emptyMessage="No engagement models yet."
      emptyIcon={Layers}
      emptyAction={{ label: "+ Add Model", href: "/admin/engagement-models/new" }}
      canDelete={canDelete}
    />
  )
}
