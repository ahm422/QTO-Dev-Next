import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

// ── TypeScript augmentation ──────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "admin";
    };
  }

  interface User {
    role: "admin";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "admin";
  }
}

// ── Config ───────────────────────────────────────────────────────────────────
const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : null;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) return null;

        // Use $queryRaw since AdminUser model isn't in the generated client yet
        const rows = await prisma.$queryRaw<
          Array<{ id: string; email: string; password_hash: string }>
        >`SELECT id, email, password_hash FROM admin_users WHERE email = ${email} LIMIT 1`;

        const user = rows[0];
        if (!user) return null;

        const valid = await compare(password, user.password_hash);
        if (!valid) return null;

        return { id: user.id, email: user.email, role: "admin" as const };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email ?? "",
        role: token.role,
      };
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
