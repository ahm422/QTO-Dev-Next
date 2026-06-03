"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { Badge } from "@/components/ui/badge"
import { deleteWhyChooseUs, toggleWhyChooseUsPublished } from "./actions"
import type { WhyChooseUs } from "@prisma/client"

const columns: AdminTableColumn<WhyChooseUs>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "context", label: "Context", render: (r) => <Badge variant="outline">{r.context}</Badge> },
  { key: "title", label: "Title" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleWhyChooseUsPublished} /> },
]

export default function WhyChooseUsTable({ rows }: { rows: WhyChooseUs[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/why-choose-us"
      onDelete={deleteWhyChooseUs}
      getItemName={(r) => r.title}
      emptyMessage="No items yet."
    />
  )
}
