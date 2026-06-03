"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { Badge } from "@/components/ui/badge"
import { deleteTestimonial, toggleTestimonialPublished } from "./actions"
import type { Testimonial } from "@prisma/client"

const columns: AdminTableColumn<Testimonial>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "clientName", label: "Client" },
  { key: "clientCompany", label: "Company" },
  { key: "mediaType", label: "Media", render: (r) => <Badge variant="outline">{r.mediaType}</Badge> },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleTestimonialPublished} /> },
]

export default function TestimonialsTable({ rows }: { rows: Testimonial[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/testimonials"
      onDelete={deleteTestimonial}
      getItemName={(r) => r.clientName}
      emptyMessage="No testimonials yet."
    />
  )
}
