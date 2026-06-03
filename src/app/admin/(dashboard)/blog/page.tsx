import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import BlogTable from "./Table"

export default async function BlogPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } })
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-semibold">Blog</h2><p className="text-sm text-muted-foreground">{rows.length} total</p></div>
        <Button asChild size="sm"><Link href="/admin/blog/new"><Plus className="h-4 w-4 mr-1" />New post</Link></Button>
      </div>
      <BlogTable rows={rows} />
    </div>
  )
}
