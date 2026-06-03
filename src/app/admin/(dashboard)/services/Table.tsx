"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteService, reorderServices, toggleServicePublished } from "./actions"
import type { Service } from "@prisma/client"
import { Briefcase } from "lucide-react"

const columns: AdminTableColumn<Service>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  { key: "title", label: "Service", render: (r) => (
    <div>
      <p className="text-sm font-medium text-foreground">{r.title}</p>
      {r.shortDescription && <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">{r.shortDescription}</p>}
    </div>
  )},
  { key: "slug", label: "Slug", render: (r) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{r.slug}</code> },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
  {
    key: "tags",
    label: "Tags",
    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {(r.technologyTags as string[]).slice(0, 3).map((t) => (
          <CategoryBadge key={t} category={t} />
        ))}
        {(r.technologyTags as string[]).length > 3 && (
          <span className="text-xs text-muted-foreground">+{(r.technologyTags as string[]).length - 3}</span>
        )}
      </div>
    ),
  },
]

export default function ServicesTable({ rows }: { rows: Service[] }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/services"
      onDelete={deleteService}
      onReorder={reorderServices}
      getItemName={(r) => r.title}
      emptyMessage="No services yet."
      emptyIcon={Briefcase}
      emptyAction={{ label: "+ Add Service", href: "/admin/services/new" }}
    />
  )
}
