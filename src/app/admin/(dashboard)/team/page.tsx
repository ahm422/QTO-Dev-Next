import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TeamTable from "./Table"

export default async function TeamPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold">Team</h2><p className="text-sm text-muted-foreground">{rows.length} members</p></div>
        <Button asChild size="sm"><Link href="/admin/team/new"><Plus className="h-4 w-4 mr-1" />Add member</Link></Button>
      </div>
      <TeamTable rows={rows} />
    </div>
  )
}
