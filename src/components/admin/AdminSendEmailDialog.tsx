"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AdminSendEmailDialogProps = {
  toEmail: string;
  recipientName?: string | null;
  defaultSubject?: string;
  triggerClassName?: string;
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  triggerLabel?: string;
};

export default function AdminSendEmailDialog({
  toEmail,
  recipientName,
  defaultSubject = "",
  triggerClassName,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerLabel = "Send email",
}: AdminSendEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function resetForm() {
    setSubject(defaultSubject);
    setMessage("");
  }

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toEmail,
          subject: subject.trim(),
          message: message.trim(),
          recipientName: recipientName ?? null,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.success) {
        toast.error(data?.error ?? "Failed to send email");
        return;
      }

      toast.success(`Email sent to ${toEmail}`);
      resetForm();
      setOpen(false);
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          <Mail className="h-3.5 w-3.5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send email</DialogTitle>
          <DialogDescription>
            Message {recipientName ? `${recipientName} ` : ""}
            at {toEmail}. Replies go to the admin inbox.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="admin-email-subject">Subject</Label>
            <Input
              id="admin-email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              disabled={sending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email-message">Message</Label>
            <Textarea
              id="admin-email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              maxLength={10000}
              disabled={sending}
              placeholder="Write your reply…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSend} disabled={sending}>
            {sending ? "Sending…" : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
