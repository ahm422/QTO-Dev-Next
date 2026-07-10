import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseMetadata } from "@/lib/metadata";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader";
import { Inbox } from "lucide-react";
import ContactSubmissionsTable from "./Table";

export default async function ContactSubmissionsPage() {
  const session = await getServerSession();
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) {
    redirect("/admin/unauthorized");
  }

  const rawRows = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = rawRows.map((row) => ({
    ...row,
    metadata: parseMetadata(row.metadata),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Submissions"
        subtitle="Inbound messages from the contact form"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Contact Submissions" },
        ]}
      />
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No contact submissions yet.
          </p>
        </div>
      ) : (
        <ContactSubmissionsTable rows={rows} />
      )}
    </div>
  );
}
