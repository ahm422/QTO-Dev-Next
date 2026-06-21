import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import { FileText, ExternalLink } from "lucide-react"

export default async function JobApplicationsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")

  const rows = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { job: { select: { title: true } } },
  })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Job Applications"
        subtitle="Applications received for open positions"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Job Applications" }]}
      />
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-muted py-20 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No job applications yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applicant</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Position</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Resume</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">LinkedIn</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{row.name}</p>
                    <a href={`mailto:${row.email}`} className="text-xs text-primary hover:underline">{row.email}</a>
                  </td>
                  <td className="px-4 py-3 text-foreground">{row.jobTitle}</td>
                  <td className="px-4 py-3">
                    {row.resumeUrl ? (
                      <a
                        href={row.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.linkedinUrl ? (
                      <a
                        href={row.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Profile <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
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
