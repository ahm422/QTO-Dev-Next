"use client"

import DataTable from "@/components/admin/data/DataTable"
import StatusBadge from "@/components/admin/data/StatusBadge"
import CategoryBadge from "@/components/admin/data/CategoryBadge"
import { type AdminTableColumn } from "@/components/admin/AdminTable"
import { deleteBlogPost, toggleBlogPostPublished } from "./actions"
import type { BlogPost } from "@prisma/client"
import { FileText } from "lucide-react"

const columns: AdminTableColumn<BlogPost>[] = [
  {
    key: "title",
    label: "Post",
    render: (r) => (
      <div>
        <p className="text-sm font-medium text-foreground">{r.title}</p>
        {r.slug && <p className="text-xs text-muted-foreground font-mono mt-0.5">{r.slug}</p>}
      </div>
    ),
  },
  { key: "category", label: "Category", render: (r) => r.category ? <CategoryBadge category={r.category} /> : <span className="text-muted-foreground text-xs">—</span> },
  { key: "author", label: "Author", render: (r) => <span className="text-sm text-foreground">{r.author}</span> },
  { key: "isPublished", label: "Status", render: (r) => <StatusBadge status={r.isPublished} /> },
]

export default function BlogTable({ rows, canDelete, canCreate }: { rows: BlogPost[] ; canDelete?: boolean; canCreate?: boolean }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/blog"
      onDelete={deleteBlogPost}
      getItemName={(r) => r.title}
      emptyMessage="No blog posts yet."
      emptyIcon={FileText}
      emptyAction={canCreate !== false ? { label: "+ Add Post", href: "/admin/blog/new" } : undefined}
      canDelete={canDelete}
    />
  )
}
