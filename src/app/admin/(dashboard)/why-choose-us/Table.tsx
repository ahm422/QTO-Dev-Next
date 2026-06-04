"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteWhyChooseUs, reorderWhyChooseUs, toggleWhyChooseUsPublished } from "./actions"
import type { WhyChooseUs } from "@prisma/client"
import { CheckCircle } from "lucide-react"

const columns: AdminTableColumn<WhyChooseUs>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  { key: "context", label: "Context", render: (r) => <CategoryBadge category={r.context} /> },
  {
    key: "title",
    label: "Title",
    render: (r) => <p className="text-sm font-medium text-foreground">{r.title}</p>,
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function WhyChooseUsTable({ rows }: { rows: WhyChooseUs[] }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/why-choose-us"
      onDelete={deleteWhyChooseUs}
      onReorder={reorderWhyChooseUs}
      getItemName={(r) => r.title}
      emptyMessage="No items yet."
      emptyIcon={CheckCircle}
      emptyAction={{ label: "+ Add Item", href: "/admin/why-choose-us/new" }}
    />
  )
}
