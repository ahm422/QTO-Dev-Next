"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteFeaturedWork, toggleFeaturedWorkPublished } from "./actions"
import type { FeaturedWork } from "@prisma/client"

const columns: AdminTableColumn<FeaturedWork>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "title", label: "Title" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleFeaturedWorkPublished} /> },
]

export default function FeaturedWorkTable({ rows }: { rows: FeaturedWork[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/featured-work"
      onDelete={deleteFeaturedWork}
      getItemName={(r) => r.title}
      emptyMessage="No featured work yet."
    />
  )
}
