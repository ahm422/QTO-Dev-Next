"use client"

import AdminTable, { type AdminTableColumn } from "@/components/admin/AdminTable"
import PublishToggle from "@/components/admin/PublishToggle"
import { Badge } from "@/components/ui/badge"
import { deleteBlogPost, toggleBlogPostPublished } from "./actions"
import type { BlogPost } from "@prisma/client"

const columns: AdminTableColumn<BlogPost>[] = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category", render: (r) => r.category ? <Badge variant="secondary">{r.category}</Badge> : null },
  { key: "author", label: "Author" },
  { key: "isPublished", label: "Status", render: (r) => <PublishToggle id={r.id} isPublished={r.isPublished} action={toggleBlogPostPublished} /> },
]

export default function BlogTable({ rows }: { rows: BlogPost[] }) {
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      editBasePath="/admin/blog"
      onDelete={deleteBlogPost}
      getItemName={(r) => r.title}
      emptyMessage="No blog posts yet."
    />
  )
}
