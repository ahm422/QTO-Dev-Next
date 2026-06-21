"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { Monitor, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface SessionRow {
  id: string;
  deviceLabel: string;
  ip: string;
  createdAt: string;
  lastUsedAt: string;
  isCurrent: boolean;
}

function RevokeButton({ session }: { session: SessionRow }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRevoke() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/auth/sessions/${session.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          toast.error(body?.error ?? "Failed to revoke session.");
          return;
        }
        if (body?.wasCurrent) {
          toast.success("Session revoked. Signing you out…");
          router.push("/admin/login");
        } else {
          toast.success("Session revoked.");
          router.refresh();
        }
      } catch {
        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isPending}
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          {session.isCurrent ? "Sign out" : "Revoke"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {session.isCurrent ? "Sign out this device?" : "Revoke session?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {session.isCurrent
              ? "You will be signed out immediately and redirected to the login page."
              : `This will immediately revoke access for "${session.deviceLabel}" from ${session.ip}. That device will need to sign in again.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevoke}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Revoking…" : session.isCurrent ? "Sign out" : "Revoke"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RevokeOthersButton({ disabled }: { disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRevokeOthers() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/sessions", {
          method: "DELETE",
          credentials: "include",
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          toast.error(body?.error ?? "Failed to revoke sessions.");
          return;
        }
        const count = body?.revokedCount ?? 0;
        toast.success(
          count === 0
            ? "No other sessions to revoke."
            : `Signed out ${count} other ${count === 1 ? "session" : "sessions"}.`
        );
        router.refresh();
      } catch {
        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || isPending}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out all other devices
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out all other devices?</AlertDialogTitle>
          <AlertDialogDescription>
            This will revoke all active sessions except the one you&apos;re currently using. You
            will stay signed in on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRevokeOthers} disabled={isPending}>
            {isPending ? "Signing out…" : "Sign out others"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SessionsTable({ sessions }: { sessions: SessionRow[] }) {
  const otherCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sessions.length} active {sessions.length === 1 ? "session" : "sessions"}
        </p>
        <RevokeOthersButton disabled={otherCount === 0} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Signed in</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:nth-child(even)]:bg-muted/15">
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {session.deviceLabel}
                    </span>
                    {session.isCurrent && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        This device
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">
                  {session.ip}
                </TableCell>
                <TableCell>
                  <span
                    className="text-sm text-muted-foreground"
                    title={format(new Date(session.createdAt), "PPpp")}
                  >
                    {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className="text-sm text-foreground"
                    title={format(new Date(session.lastUsedAt), "PPpp")}
                  >
                    {formatDistanceToNow(new Date(session.lastUsedAt), { addSuffix: true })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <RevokeButton session={session} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
