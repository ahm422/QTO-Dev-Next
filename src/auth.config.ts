import type { NextAuthConfig } from "next-auth";

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

export const authConfig: NextAuthConfig = {
  providers: [],
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as "admin";
      }
      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session.user as any) = {
        id: token.id,
        email: token.email ?? "",
        role: token.role,
      };
      return session;
    },
  },
};
