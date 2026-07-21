import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { AuthBackground } from "./_components/AuthBackground";
import { AuthLogo } from "./_components/AuthLogo";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <div className="relative min-h-screen bg-background lg:grid lg:grid-cols-2">
        {/* Branded panel — desktop only */}
        <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
          <AuthBackground />
          <div className="relative z-10">
            <AuthLogo priority width={148} height={40} className="h-10 w-auto object-contain" />
          </div>
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Manage your workspace with confidence.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Secure, invitation-only access to the QTO Dev admin console.
            </p>
          </div>
          <div className="relative z-10 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QTO Dev
          </div>
        </aside>

        {/* Login card column — background shows through on mobile only */}
        <main className="relative flex min-h-screen items-center justify-center overflow-y-auto px-4 py-12 lg:min-h-0">
          <AuthBackground className="lg:hidden" />
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <AuthLogo priority />
            </div>
            {children}
          </div>
        </main>
      </div>
    </AdminThemeProvider>
  );
}
