import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import { ClipboardList } from "lucide-react"

export default async function RequirementsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")

  const rows = await prisma.requirement.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Requirements"
        subtitle="Project enquiries submitted via the intake form"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Requirements" }]}
      />
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-muted py-20 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No requirements submitted yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Intent</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Budget</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${row.email}`} className="text-primary hover:underline">{row.email}</a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.company ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {row.intent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.budgetRange ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {row.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
