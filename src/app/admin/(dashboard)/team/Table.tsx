"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { deleteTeamMember, toggleTeamMemberPublished } from "./actions"
import type { TeamMember } from "@prisma/client"

const columns: AdminTableColumn<TeamMember>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs">{r.order}</span> },
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleTeamMemberPublished} /> },
]

export default function TeamTable({ rows }: { rows: TeamMember[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/team"
      onDelete={deleteTeamMember}
      getItemName={(r) => r.name}
      emptyMessage="No team members yet."
    />
  )
}
