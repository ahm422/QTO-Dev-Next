"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { Badge } from "@/components/ui/badge"
import { deleteFaq, reorderFaqs, toggleFaqPublished } from "./actions"
import type { Faq } from "@prisma/client"

const columns: AdminTableColumn<Faq>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "context", label: "Context", render: (r) => <Badge variant="outline">{r.context}</Badge> },
  { key: "question", label: "Question" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleFaqPublished} /> },
]

export default function FaqsTable({ rows }: { rows: Faq[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/faqs"
      onDelete={deleteFaq}
      onReorder={reorderFaqs}
      getItemName={(r) => r.question}
      emptyMessage="No FAQs yet."
    />
  )
}
