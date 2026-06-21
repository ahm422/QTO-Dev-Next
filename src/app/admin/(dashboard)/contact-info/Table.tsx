"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteContactInfo, reorderContactInfo, toggleContactInfoPublished } from "./actions"
import type { ContactInfo } from "@prisma/client"
import { Phone } from "lucide-react"

const columns: AdminTableColumn<ContactInfo>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  { key: "type", label: "Type", render: (r) => <CategoryBadge category={r.type} /> },
  {
    key: "label",
    label: "Contact",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.label}</p>
        <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">{r.value}</p>
      </div>
    ),
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function ContactInfoTable({ rows, canDelete }: { rows: ContactInfo[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/contact-info"
      onDelete={deleteContactInfo}
      onReorder={reorderContactInfo}
      getItemName={(r) => r.label}
      emptyMessage="No contact info yet."
      emptyIcon={Phone}
      emptyAction={{ label: "+ Add Contact", href: "/admin/contact-info/new" }}
      canDelete={canDelete}
    />
  )
}
