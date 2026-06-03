import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import FeaturedWorkTable from "./Table"

export default async function FeaturedWorkPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.featuredWork.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold">Featured Work</h2><p className="text-sm text-muted-foreground">{rows.length} total</p></div>
        <Button asChild size="sm"><Link href="/admin/featured-work/new"><Plus className="h-4 w-4 mr-1" />Add item</Link></Button>
      </div>
      <FeaturedWorkTable rows={rows} />
    </div>
  )
}
