import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

function hasGitHubOAuth() {
  return Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
}

function hasPostgres() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

const providers = hasGitHubOAuth()
  ? [
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET
      })
    ]
  : [];

const pool = hasPostgres()
  ? new Pool({
      connectionString: process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL
    })
  : undefined;

export const authConfig = {
  adapter: pool ? PostgresAdapter(pool) : undefined,
  providers,
  pages: {
    signIn: "/"
  },
  session: {
    strategy: hasPostgres() ? "database" : "jwt"
  },
  callbacks: {
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
  return hasGitHubOAuth();
}
