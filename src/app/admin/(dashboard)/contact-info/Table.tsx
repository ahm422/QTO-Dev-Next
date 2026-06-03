"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteContactInfo, toggleContactInfoPublished } from "./actions"
import type { ContactInfo } from "@prisma/client"

const columns: AdminTableColumn<ContactInfo>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "type", label: "Type" },
  { key: "label", label: "Label" },
  { key: "value", label: "Value" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleContactInfoPublished} /> },
]

export default function ContactInfoTable({ rows }: { rows: ContactInfo[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/contact-info"
      onDelete={deleteContactInfo}
      getItemName={(r) => r.label}
      emptyMessage="No contact info yet."
    />
  )
}
