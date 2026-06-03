import { signOut } from "@/auth";
import { NextResponse } from "next/server";

async function handleSignOut() {
  await signOut({ redirect: false });
  return NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    { status: 303 }
  );
}

export async function POST() {
  return handleSignOut();
}

export async function GET() {
  return handleSignOut();
}
