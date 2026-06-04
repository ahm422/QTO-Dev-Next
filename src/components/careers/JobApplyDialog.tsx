"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/components/theme/cn"
import { jobApplicationSchema, type JobApplicationInput } from "@/lib/validators/jobApplication"
import { analytics } from "@/lib/analytics"
import type { AppIconName } from "@/components/ui/shared/AppIcon"
import { AppIcon } from "@/components/ui/shared/AppIcon"

interface JobForApply {
  id: string
  title: string
  department: string
  location: string
  employmentType?: string
  applyUrl?: string | null
}

interface JobApplyDialogProps {
  job: JobForApply
  triggerClassName?: string
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-1">{message}</p>
}

export function JobApplyDialog({ job, triggerClassName }: JobApplyDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState("")
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobApplicationInput>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      jobId: job.id,
      jobTitle: job.title,
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
      resumeUrl: "",
      linkedinUrl: "",
    },
  })

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      analytics.trackEvent("careers_apply_open", {
        jobId: job.id,
        title: job.title,
      })
    }
    if (!next) {
      setTimeout(() => {
        reset()
        setSubmitted(false)
        setSubmittedName("")
        setServerError(null)
      }, 300)
    }
  }

  async function onSubmit(data: JobApplicationInput) {
    setServerError(null)
    try {
      const res = await fetch("/api/careers/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = (await res.json()) as { success: boolean; error?: string }

      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong. Please try again.")
        return
      }

      setSubmittedName(data.name)
      setSubmitted(true)
      analytics.trackEvent("careers_apply_submit", {
        jobId: job.id,
        title: job.title,
        hasResume: Boolean(data.resumeUrl),
      })
    } catch {
      setServerError("Network error. Please check your connection and try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className={cn(
          "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold sm:w-auto",
          "bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300",
          "hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          triggerClassName
        )}
      >
        Apply now
        <AppIcon name={"arrow-right" as AppIconName} size="sm" className="!text-xs" />
      </button>

      <DialogContent showCloseButton className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Application received!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Thanks {submittedName.split(" ")[0]} — we&apos;ll review your application for{" "}
                <strong>{job.title}</strong> and be in touch soon.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {job.department}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {job.location}
                  </span>
                  {job.employmentType && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {job.employmentType}
                    </span>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              {/* Hidden fields */}
              <input type="hidden" {...register("jobId")} />
              <input type="hidden" {...register("jobTitle")} />

              {/* Name + Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="apply-name">
                    Full name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="apply-name"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    {...register("name")}
                  />
                  <FieldError message={errors.name?.message} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apply-email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="apply-email"
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="apply-phone">
                  Phone <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="apply-phone"
                  type="tel"
                  placeholder="+92 300 0000000"
                  autoComplete="tel"
                  {...register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <Label htmlFor="apply-linkedin">
                  LinkedIn URL <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="apply-linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  {...register("linkedinUrl")}
                />
                <FieldError message={errors.linkedinUrl?.message} />
              </div>

              {/* Resume URL */}
              <div className="space-y-1">
                <Label htmlFor="apply-resume">
                  Resume / CV URL <span className="text-muted-foreground text-xs">(optional — Google Drive, Dropbox, etc.)</span>
                </Label>
                <Input
                  id="apply-resume"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  {...register("resumeUrl")}
                />
                <FieldError message={errors.resumeUrl?.message} />
              </div>

              {/* Cover letter */}
              <div className="space-y-1">
                <Label htmlFor="apply-cover">
                  Cover letter <span className="text-muted-foreground text-xs">(optional · max 2000 chars)</span>
                </Label>
                <Textarea
                  id="apply-cover"
                  placeholder="Tell us why you're a great fit…"
                  rows={4}
                  maxLength={2000}
                  {...register("coverLetter")}
                />
                <FieldError message={errors.coverLetter?.message} />
              </div>

              {serverError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverError}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center pt-2">
                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      analytics.trackEvent("careers_portal_fallback", { jobId: job.id })
                    }
                    className="text-xs text-muted-foreground underline-offset-4 hover:underline text-center sm:text-left"
                  >
                    Apply on portal instead
                  </a>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary-hover sm:ml-auto"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Submitting…" : "Submit application"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
