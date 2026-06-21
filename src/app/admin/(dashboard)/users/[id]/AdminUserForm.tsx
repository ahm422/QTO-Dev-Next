"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ADMIN_ROLES } from "@/lib/auth/roles";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
};

interface AdminUserFormUser {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminUserFormProps {
  defaultValues?: AdminUserFormUser;
  currentUserId: string;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 text-sm">
      <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-foreground break-all">{value}</dd>
    </div>
  );
}

export default function AdminUserForm({ defaultValues, currentUserId }: AdminUserFormProps) {
  const isEdit = !!defaultValues;
  const isSelf = isEdit && defaultValues.id === currentUserId;
  const router = useRouter();

  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(defaultValues?.displayName ?? "");
  const [role, setRole] = useState<string>(defaultValues?.role ?? "editor");
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!isEdit && password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      let res: Response;

      if (isEdit) {
        res = await fetch(`/api/admin/users/${defaultValues.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role,
            displayName: displayName.trim() || null,
            isActive,
          }),
        });
      } else {
        res = await fetch("/api/admin/users", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
            role,
            displayName: displayName.trim() || undefined,
          }),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const fieldError = body?.details?.fieldErrors?.password?.[0]
          ?? body?.details?.fieldErrors?.email?.[0]
          ?? body?.details?.fieldErrors?.role?.[0];
        setFormError(fieldError ?? body?.error ?? "Something went wrong.");
        return;
      }

      toast.success(isEdit ? "User updated." : "User created.");
      router.push("/admin/users");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {/* Email */}
          {isEdit ? (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm text-foreground">{defaultValues.email}</p>
            </div>
          ) : (
            <FormInput
              label="Email"
              name="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          )}

          {/* Display name */}
          <FormInput
            label="Display name (optional)"
            name="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSubmitting}
          />

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={setRole}
              disabled={isSubmitting || isSelf}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r] ?? r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isSelf && (
              <p className="text-xs text-muted-foreground">You cannot change your own role.</p>
            )}
          </div>

          {/* Password fields (create only) */}
          {!isEdit && (
            <>
              <FormInput
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <FormInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <div className="rounded-md bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">Password requirements</p>
                <ul className="list-disc list-inside space-y-0.5 mt-1">
                  <li>At least 12 characters</li>
                  <li>Uppercase letter, lowercase letter, digit, special character</li>
                </ul>
              </div>
            </>
          )}

          {/* Active toggle (edit only) */}
          {isEdit && (
            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isSubmitting || isSelf}
              />
              <Label htmlFor="isActive">Active</Label>
              {isSelf && (
                <span className="text-xs text-muted-foreground">Cannot deactivate yourself.</span>
              )}
            </div>
          )}

          {/* Read-only metadata (edit only) */}
          {isEdit && (
            <dl className="space-y-2 rounded-md border border-border bg-muted/30 px-4 py-3">
              <MetaRow
                label="Created"
                value={new Date(defaultValues.createdAt).toLocaleString()}
              />
              <MetaRow
                label="Last login"
                value={
                  defaultValues.lastLoginAt
                    ? new Date(defaultValues.lastLoginAt).toLocaleString()
                    : "Never"
                }
              />
              {defaultValues.lastLoginIp && (
                <MetaRow label="Last IP" value={defaultValues.lastLoginIp} />
              )}
            </dl>
          )}
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/users")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create user"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
