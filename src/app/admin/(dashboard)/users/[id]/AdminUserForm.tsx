"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Shield } from "lucide-react";
import { FormInput } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  FormSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminForm from "@/components/admin/AdminForm";
import FormSection from "@/components/admin/forms/FormSection";
import FormGrid from "@/components/admin/forms/FormGrid";
import { PasswordRequirementsChecklist } from "@/components/admin/forms/PasswordRequirementsChecklist";
import { ADMIN_ROLES } from "@/lib/auth/roles";

const ROLE_CONFIG: Record<string, { label: string; dotClass: string }> = {
  super_admin: { label: "Super Admin", dotClass: "bg-rose-500" },
  admin: { label: "Admin", dotClass: "bg-primary" },
  editor: { label: "Editor", dotClass: "bg-emerald-500" },
  hr: { label: "HR", dotClass: "bg-amber-500" },
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
      <AdminForm
        isSubmitting={isSubmitting}
        cancelHref="/admin/users"
        submitLabel={isEdit ? "Save changes" : "Create user"}
      >
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        {/* Account section */}
        <FormSection title="Account" icon={User}>
          {/* Email (full width, above the 2-col grid) */}
          {isEdit ? (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm text-foreground">{defaultValues.email}</p>
            </div>
          ) : (
            <FormInput
              label="Email address"
              name="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              description="This will be their login email and cannot be changed after creation."
            />
          )}

          <FormGrid cols={2}>
            {/* Display name */}
            <FormInput
              label="Display name"
              name="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isSubmitting}
              description="Shown in the admin panel. Defaults to email if left blank."
            />

            {/* Role */}
            <FormSelect
              label="Role"
              required
              value={role}
              onValueChange={setRole}
              disabled={isSubmitting || isSelf}
              description={
                isSelf
                  ? "You cannot change your own role."
                  : "Controls what this user can access in the admin."
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role">
                  {role && ROLE_CONFIG[role] && (
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${ROLE_CONFIG[role].dotClass}`} />
                      {ROLE_CONFIG[role].label}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${ROLE_CONFIG[r]?.dotClass ?? "bg-muted"}`} />
                      {ROLE_CONFIG[r]?.label ?? r}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>
          </FormGrid>
        </FormSection>

        {/* Security section (create only) */}
        {!isEdit && (
          <FormSection title="Security" icon={Shield}>
            <FormGrid cols={2}>
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
            </FormGrid>
            <PasswordRequirementsChecklist password={password} />
          </FormSection>
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
      </AdminForm>
    </form>
  );
}
