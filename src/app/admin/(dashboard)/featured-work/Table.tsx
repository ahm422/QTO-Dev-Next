"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteFeaturedWork, reorderFeaturedWork, toggleFeaturedWorkPublished } from "./actions"
import type { FeaturedWork } from "@prisma/client"
import { Star } from "lucide-react"

const columns: AdminTableColumn<FeaturedWork>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "title",
    label: "Work",
    render: (r) => <p className="text-sm font-medium text-foreground">{r.title}</p>,
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function FeaturedWorkTable({ rows }: { rows: FeaturedWork[] }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/featured-work"
      onDelete={deleteFeaturedWork}
      onReorder={reorderFeaturedWork}
      getItemName={(r) => r.title}
      emptyMessage="No featured work yet."
      emptyIcon={Star}
      emptyAction={{ label: "+ Add Work", href: "/admin/featured-work/new" }}
    />
  )
}
