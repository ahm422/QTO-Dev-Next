"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookACallPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/contact#book-a-call");
  }, [router]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold">Book a call</h1>
      <p className="mt-3 text-foreground-muted">
        This page has moved. If you’re not redirected automatically, use the
        link below.
      </p>
      <p className="mt-6">
        <Link
          href="/contact#book-a-call"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Go to Contact → Book a call
        </Link>
      </p>
    </main>
  );
}

