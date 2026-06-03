import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import JobsTable from "./Table"

export default async function JobsPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.job.findMany({ orderBy: { createdAt: "desc" } })
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-semibold">Jobs</h2><p className="text-sm text-muted-foreground">{rows.length} listings</p></div>
        <Button asChild size="sm"><Link href="/admin/jobs/new"><Plus className="h-4 w-4 mr-1" />Add job</Link></Button>
      </div>
      <JobsTable rows={rows} />
    </div>
  )
}
