"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteFaq, reorderFaqs, toggleFaqPublished } from "./actions"
import type { Faq } from "@prisma/client"
import { HelpCircle } from "lucide-react"

const columns: AdminTableColumn<Faq>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  { key: "context", label: "Context", render: (r) => <CategoryBadge category={r.context} /> },
  {
    key: "question",
    label: "Question",
    render: (r) => <p className="text-sm font-medium text-foreground truncate max-w-sm">{r.question}</p>,
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function FaqsTable({ rows }: { rows: Faq[] }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/faqs"
      onDelete={deleteFaq}
      onReorder={reorderFaqs}
      getItemName={(r) => r.question}
      emptyMessage="No FAQs yet."
      emptyIcon={HelpCircle}
      emptyAction={{ label: "+ Add FAQ", href: "/admin/faqs/new" }}
    />
  )
}
