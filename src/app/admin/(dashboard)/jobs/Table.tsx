"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteJob, reorderJobs, toggleJobPublished } from "./actions"
import type { Job } from "@prisma/client"
import { Briefcase } from "lucide-react"

const columns: AdminTableColumn<Job>[] = [
  {
    key: "title",
    label: "Position",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{r.location}</p>
      </div>
    ),
  },
  { key: "department", label: "Department", render: (r) => <CategoryBadge category={r.department} /> },
  { key: "type", label: "Type", render: (r) => <CategoryBadge category={r.type} /> },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function JobsTable({ rows, canDelete }: { rows: Job[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/jobs"
      onDelete={deleteJob}
      onReorder={reorderJobs}
      getItemName={(r) => r.title}
      emptyMessage="No job listings yet."
      emptyIcon={Briefcase}
      emptyAction={{ label: "+ Add Job", href: "/admin/jobs/new" }}
      canDelete={canDelete}
    />
  )
}
