import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/shared/Text";

export default function AdminHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
        Admin home
      </h1>
      <Text size="sm" color="muted" className="mb-6 text-center">
        CMS dashboard and content tools will be added in a later phase.
      </Text>
      <form action="/admin/logout" method="post">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
      <Link
        href="/"
        className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Back to site
      </Link>
    </div>
  );
}
