"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import RoleBadge from "@/components/admin/data/RoleBadge";
import StatusBadge from "@/components/admin/data/StatusBadge";
import EmptyState from "@/components/admin/data/EmptyState";
import { Users } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

interface UsersTableProps {
  rows: UserRow[];
  currentUserId: string;
}

function ForceLogoutButton({ userId, email }: { userId: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}/force-logout`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          toast.error(body?.error ?? "Failed to force logout.");
          return;
        }
        toast.success(`${email} has been signed out of all sessions.`);
        router.refresh();
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Force logout">
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Force logout</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Force logout {email}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately revoke all active sessions for this user. They will need to sign
            in again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Signing out…" : "Force logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeactivateButton({ userId, email, disabled }: { userId: string; email: string; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          toast.error(body?.error ?? "Failed to deactivate user.");
          return;
        }
        toast.success(`${email} has been deactivated.`);
        router.refresh();
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={disabled}
          title={disabled ? "Cannot deactivate your own account" : "Deactivate user"}
        >
          Deactivate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate {email}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate the account and revoke all active sessions. The user will not be
            able to sign in until reactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deactivating…" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ReactivateButton({ userId, email }: { userId: string; email: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleReactivate() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: true }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          toast.error(body?.error ?? "Failed to reactivate user.");
          return;
        }
        toast.success(`${email} has been reactivated.`);
        router.refresh();
      } catch {
        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10"
      disabled={isPending}
      onClick={handleReactivate}
    >
      {isPending ? "Reactivating…" : "Reactivate"}
    </Button>
  );
}

function formatDate(date: Date | null) {
  if (!date) return <span className="text-muted-foreground text-xs">Never</span>;
  return (
    <span className="text-sm text-foreground">
      {new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
}

export default function UsersTable({ rows, currentUserId }: UsersTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <EmptyState
          message="No admin users yet."
          icon={Users}
          action={{ label: "+ Add User", href: "/admin/users/new" }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:nth-child(even)]:bg-muted/15">
          {rows.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.displayName ?? user.email}
                  </p>
                  {user.displayName && (
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={user.isActive}
                  publishedLabel="Active"
                  draftLabel="Inactive"
                />
              </TableCell>
              <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/admin/users/${user.id}`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <ForceLogoutButton userId={user.id} email={user.email} />
                  {user.isActive ? (
                    <DeactivateButton
                      userId={user.id}
                      email={user.email}
                      disabled={user.id === currentUserId}
                    />
                  ) : (
                    <ReactivateButton userId={user.id} email={user.email} />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
