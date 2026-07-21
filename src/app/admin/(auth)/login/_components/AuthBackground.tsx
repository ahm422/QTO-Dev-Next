import { cn } from "@/lib/utils";

/**
 * Decorative animated mesh background for the admin auth screens.
 *
 * - Purely presentational: aria-hidden + pointer-events-none.
 * - Colors read from admin tokens (--primary, --admin-accent-*) via color-mix,
 *   so the mesh recolors correctly between .admin-dark and .admin-light.
 * - Only transform/opacity are animated (GPU-friendly); blur is static.
 * - prefers-reduced-motion pauses the drift via the global reduced-motion block,
 *   falling back to a static gradient.
 */
export function AuthBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Base wash keeps the mesh legible on both themes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--primary) 6%, transparent) 0%, transparent 60%)",
        }}
      />

      <div
        className="admin-auth-blob-a absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--primary) 45%, transparent), transparent)",
        }}
      />
      <div
        className="admin-auth-blob-b absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--admin-accent-purple) 42%, transparent), transparent)",
        }}
      />
      <div
        className="admin-auth-blob-c absolute -bottom-32 left-1/4 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--admin-accent-blue) 40%, transparent), transparent)",
        }}
      />
      <div
        className="admin-auth-blob-a absolute -bottom-24 -right-16 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--admin-accent-teal) 38%, transparent), transparent)",
        }}
      />
    </div>
  );
}
