import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseMetadata } from "@/lib/metadata";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader";
import { ClipboardList } from "lucide-react";
import RequirementsTable from "./Table";

export default async function RequirementsPage() {
  const session = await getServerSession();
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) {
    redirect("/admin/unauthorized");
  }

  const rawRows = await prisma.requirement.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = rawRows.map((row) => ({
    ...row,
    metadata: parseMetadata(row.metadata),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Requirements"
        subtitle="Project enquiries submitted via the intake form"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Requirements" },
        ]}
      />
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No requirements submitted yet.
          </p>
        </div>
      ) : (
        <RequirementsTable rows={rows} />
      )}
    </div>
  );
}
