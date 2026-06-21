"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteProject, reorderProjects, toggleProjectPublished } from "./actions"
import type { Project } from "@prisma/client"
import { FolderOpen } from "lucide-react"

const columns: AdminTableColumn<Project>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "title",
    label: "Project",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.title}</p>
        {r.client && <p className="text-xs text-muted-foreground mt-0.5">{r.client}</p>}
      </div>
    ),
  },
  { key: "category", label: "Category", render: (r) => r.category ? <CategoryBadge category={r.category} /> : <span className="text-muted-foreground text-xs">—</span> },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function ProjectsTable({ rows, canDelete }: { rows: Project[] ; canDelete?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/projects"
      onDelete={deleteProject}
      onReorder={reorderProjects}
      getItemName={(r) => r.title}
      emptyMessage="No projects yet."
      emptyIcon={FolderOpen}
      emptyAction={{ label: "+ Add Project", href: "/admin/projects/new" }}
      canDelete={canDelete}
    />
  )
}
