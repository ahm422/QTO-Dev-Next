"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { Badge } from "@/components/ui/badge"
import { deleteService, reorderServices, toggleServicePublished } from "./actions"
import type { Service } from "@prisma/client"

const columns: AdminTableColumn<Service>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "title", label: "Title" },
  { key: "slug", label: "Slug", render: (r) => <code className="text-xs bg-muted px-1 py-0.5 rounded">{r.slug}</code> },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleServicePublished} /> },
  {
    key: "tags",
    label: "Tags",
    render: (r) =>
      (r.technologyTags as string[]).slice(0, 3).map((t) => (
        <Badge key={t} variant="secondary" className="mr-1 text-xs">{t}</Badge>
      )),
  },
]

export default function ServicesTable({ rows }: { rows: Service[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/services"
      onDelete={deleteService}
      onReorder={reorderServices}
      getItemName={(r) => r.title}
      emptyMessage="No services yet. Add your first service."
    />
  )
}
