import type { ComponentType } from "react";

type CustomIconProps = { title?: string };

export function CloudflareD1Icon({ title = "Cloudflare D1" }: CustomIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={title}>
      <path d="M6 4h8a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1H9a3 3 0 0 1 0-6h7V8a2 2 0 0 0-2-2H6z" />
      <path d="M11 10h2v4h-2z" opacity="0.85" />
    </svg>
  );
}

export function CloudflareR2Icon({ title = "Cloudflare R2" }: CustomIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={title}>
      <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zm4-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8z" />
      <path d="M8 10h8v1.5H8V10zm0 3h5.5v1.5H8V13z" opacity="0.9" />
    </svg>
  );
}

export function GarageIcon({ title = "Garage" }: CustomIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={title}>
      <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
      <path d="M8 12h8v2H8v-2z" opacity="0.75" />
    </svg>
  );
}

export function CoolifyIcon({ title = "Coolify" }: CustomIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={title}>
      <path d="M12 2c2.2 0 4.2.9 5.7 2.3L12 12 6.3 4.3A8 8 0 0 1 12 2zm6.7 4.8L13 14.2V22a8 8 0 0 0 5.7-15.2zM11 14.2 5.3 6.8A8 8 0 0 0 11 22v-7.8z" />
    </svg>
  );
}

export const CUSTOM_TECH_ICONS: Record<string, ComponentType<CustomIconProps>> = {
  "cloudflare-d1": CloudflareD1Icon,
  "cloudflare-r2": CloudflareR2Icon,
  garage: GarageIcon,
  coolify: CoolifyIcon,
};
