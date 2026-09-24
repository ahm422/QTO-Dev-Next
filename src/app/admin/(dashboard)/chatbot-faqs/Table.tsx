"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteChatbotFaq, reorderChatbotFaqs } from "./actions"
import type { ChatbotFaq } from "@prisma/client"
import { Bot } from "lucide-react"

const columns: AdminTableColumn<ChatbotFaq>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  { key: "category", label: "Category", render: (r) => <CategoryBadge category={r.category} /> },
  {
    key: "question",
    label: "Question",
    render: (r) => <p className="text-sm font-medium text-foreground truncate max-w-sm">{r.question}</p>,
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function ChatbotFaqsTable({ rows, canDelete, canCreate }: { rows: ChatbotFaq[] ; canDelete?: boolean; canCreate?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/chatbot-faqs"
      onDelete={deleteChatbotFaq}
      onReorder={reorderChatbotFaqs}
      getItemName={(r) => r.question}
      emptyMessage="No chatbot FAQs yet."
      emptyIcon={Bot}
      emptyAction={canCreate !== false ? { label: "+ Add FAQ", href: "/admin/chatbot-faqs/new" } : undefined}
      canDelete={canDelete}
    />
  )
}
