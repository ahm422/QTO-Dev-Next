"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteTestimonial, reorderTestimonials, toggleTestimonialPublished } from "./actions"
import type { Testimonial } from "@prisma/client"
import { MessageSquare } from "lucide-react"

const columns: AdminTableColumn<Testimonial>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "clientName",
    label: "Client",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.clientName}</p>
        {r.clientCompany && <p className="text-xs text-muted-foreground mt-0.5">{r.clientCompany}</p>}
      </div>
    ),
  },
  { key: "mediaType", label: "Media", render: (r) => <CategoryBadge category={r.mediaType} /> },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function TestimonialsTable({ rows, canDelete, canCreate }: { rows: Testimonial[] ; canDelete?: boolean; canCreate?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/testimonials"
      onDelete={deleteTestimonial}
      onReorder={reorderTestimonials}
      getItemName={(r) => r.clientName}
      emptyMessage="No testimonials yet."
      emptyIcon={MessageSquare}
      emptyAction={canCreate !== false ? { label: "+ Add Testimonial", href: "/admin/testimonials/new" } : undefined}
      canDelete={canDelete}
    />
  )
}
