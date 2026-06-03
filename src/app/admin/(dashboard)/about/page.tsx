import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AboutPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const rows = await prisma.aboutContent.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold">About</h2><p className="text-sm text-muted-foreground">{rows.length} sections</p></div>
        <Button asChild size="sm"><Link href="/admin/about/new"><Plus className="h-4 w-4 mr-1" />Add section</Link></Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">No about sections yet.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <Card key={row.section} className="hover:bg-accent/30 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <CardTitle className="text-sm font-medium">{row.section}</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1 -mt-1" asChild>
                  <Link href={`/admin/about/${row.section}`}><Pencil className="h-3.5 w-3.5" /></Link>
                </Button>
              </CardHeader>
              {row.title && <CardContent><p className="text-sm text-muted-foreground truncate">{row.title}</p></CardContent>}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
