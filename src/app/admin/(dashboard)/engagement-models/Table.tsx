"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteEngagementModel, reorderEngagementModels, toggleEngagementModelPublished } from "./actions"
import type { EngagementModel } from "@prisma/client"

const columns: AdminTableColumn<EngagementModel>[] = [
  { key: "number", label: "#" },
  { key: "title", label: "Title" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleEngagementModelPublished} /> },
]

export default function EngagementModelsTable({ rows }: { rows: EngagementModel[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/engagement-models"
      onDelete={deleteEngagementModel}
      onReorder={reorderEngagementModels}
      getItemName={(r) => r.title}
      emptyMessage="No engagement models yet."
    />
  )
}
