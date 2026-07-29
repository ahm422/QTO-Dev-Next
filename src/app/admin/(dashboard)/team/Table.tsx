"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteTeamMember, reorderTeamMembers, toggleTeamMemberPublished } from "./actions"
import type { TeamMember } from "@prisma/client"
import { Users } from "lucide-react"

const columns: AdminTableColumn<TeamMember>[] = [
  { key: "order", label: "#", render: (r) => <span className="text-muted-foreground text-xs tabular-nums">{r.order}</span> },
  {
    key: "name",
    label: "Member",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{r.role}</p>
      </div>
    ),
  },
  { key: "role", label: "Role", render: (r) => <CategoryBadge category={r.role} /> },
  {
    key: "isFounder",
    label: "Founder",
    render: (r) =>
      r.isFounder ? (
        <CategoryBadge category="Founder" className="bg-primary/10 text-primary border-primary/20" />
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function TeamTable({ rows, canDelete, canCreate }: { rows: TeamMember[] ; canDelete?: boolean; canCreate?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/team"
      onDelete={deleteTeamMember}
      onReorder={reorderTeamMembers}
      getItemName={(r) => r.name}
      emptyMessage="No team members yet."
      emptyIcon={Users}
      emptyAction={canCreate !== false ? { label: "+ Add Member", href: "/admin/team/new" } : undefined}
      canDelete={canDelete}
    />
  )
}
