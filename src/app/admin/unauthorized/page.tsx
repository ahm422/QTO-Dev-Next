import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/shared/Text";

export default function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
        Access denied
      </h1>
      <Text size="sm" color="muted" className="mb-6 max-w-md">
        Your account is signed in but does not have admin access. Contact an
        administrator if you believe this is a mistake.
      </Text>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default">
          <Link href="/admin/login">Back to sign in</Link>
        </Button>
        <form action="/admin/logout" method="post">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
