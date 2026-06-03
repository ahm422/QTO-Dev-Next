"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteProject, toggleProjectPublished } from "./actions"
import type { Project } from "@prisma/client"

const columns: AdminTableColumn<Project>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "title", label: "Title" },
  { key: "client", label: "Client" },
  { key: "category", label: "Category" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleProjectPublished} /> },
]

export default function ProjectsTable({ rows }: { rows: Project[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/projects"
      onDelete={deleteProject}
      getItemName={(r) => r.title}
      emptyMessage="No projects yet."
    />
  )
}
