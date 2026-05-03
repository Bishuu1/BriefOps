import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import { isEmailAllowed } from "./allowlist";

export function isGitHubAuthConfigured() {
  return Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
}

export function isGoogleAuthConfigured() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

function hasPostgres() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

const providers = [
  ...(isGitHubAuthConfigured()
    ? [
        GitHub({
          clientId: process.env.AUTH_GITHUB_ID!,
          clientSecret: process.env.AUTH_GITHUB_SECRET!
        })
      ]
    : []),
  ...(isGoogleAuthConfigured()
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID!,
          clientSecret: process.env.AUTH_GOOGLE_SECRET!
        })
      ]
    : [])
];

const pool = hasPostgres()
  ? new Pool({
      connectionString: process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL
    })
  : undefined;

export const authConfig = {
  adapter: pool ? PostgresAdapter(pool) : undefined,
  providers,
  pages: {
    signIn: "/",
    error: "/blocked"
  },
  session: {
    strategy: hasPostgres() ? "database" : "jwt"
  },
  callbacks: {
    async signIn({ user, profile }) {
      const email = user.email ?? profile?.email;
      return (await isEmailAllowed(email)) ? true : "/blocked";
    },
    jwt({ token, profile }) {
      if (profile?.id) token.sub = String(profile.id);
      return token;
    },
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = user?.id ?? token.sub ?? session.user.email ?? "demo-user";
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export function isAuthConfigured() {
  return providers.length > 0;
}

export function isDemoModeEnabled() {
  return process.env.BRIEFOPS_ENABLE_DEMO_MODE === "true";
}
