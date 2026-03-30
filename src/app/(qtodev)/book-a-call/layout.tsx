import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Call (Moved) | QTO Dev",
  description: "This page has moved to /contact#book-a-call.",
  robots: { index: false, follow: true },
};

export default function BookACallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

