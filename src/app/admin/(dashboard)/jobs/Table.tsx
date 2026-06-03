"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { Badge } from "@/components/ui/badge"
import { deleteJob, reorderJobs, toggleJobPublished } from "./actions"
import type { Job } from "@prisma/client"

const columns: AdminTableColumn<Job>[] = [
  { key: "title", label: "Title" },
  { key: "department", label: "Dept", render: (r) => <Badge variant="secondary">{r.department}</Badge> },
  { key: "location", label: "Location" },
  { key: "type", label: "Type" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleJobPublished} /> },
]

export default function JobsTable({ rows }: { rows: Job[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/jobs"
      onDelete={deleteJob}
      onReorder={reorderJobs}
      getItemName={(r) => r.title}
      emptyMessage="No job listings yet."
    />
  )
}
