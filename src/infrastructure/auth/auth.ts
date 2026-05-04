import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { isEmailAllowed } from "./allowlist";

export function isGitHubAuthConfigured() {
  return Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
}

export function isGoogleAuthConfigured() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

export function isCredentialsAuthConfigured() {
  return Boolean(process.env.BRIEFOPS_DEMO_EMAIL && process.env.BRIEFOPS_DEMO_PASSWORD);
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
    : []),
  ...(isCredentialsAuthConfigured()
    ? [
        Credentials({
          name: "Email",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            const email = String(credentials?.email ?? "").trim().toLowerCase();
            const password = String(credentials?.password ?? "");
            const expectedEmail = (process.env.BRIEFOPS_DEMO_EMAIL ?? "").trim().toLowerCase();
            const expectedPassword = process.env.BRIEFOPS_DEMO_PASSWORD ?? "";
            console.log("[v0] authorize attempt", { email, expectedEmail, emailMatch: email === expectedEmail, passwordLen: password.length, expectedPasswordLen: expectedPassword.length });
            if (!email || !password) return null;
            if (email !== expectedEmail || password !== expectedPassword) return null;
            console.log("[v0] authorize success", { email });
            return { id: email, email, name: email.split("@")[0] };
          }
        })
      ]
    : [])
];

// SameSite=None + Secure + Partitioned lets the auth cookies survive when the app
// runs inside a cross-origin iframe (v0 preview) and also works fine on direct
// production traffic. Auth.js still validates CSRF via its own token, so loosening
// SameSite here does not weaken auth.
const crossSiteCookieOptions = {
  sameSite: "none" as const,
  path: "/",
  secure: true,
  partitioned: true
};

export const authConfig = {
  providers,
  pages: {
    signIn: "/",
    error: "/blocked"
  },
  session: {
    strategy: "jwt"
  },
  cookies: {
    sessionToken: {
      name: "__Secure-authjs.session-token",
      options: { httpOnly: true, ...crossSiteCookieOptions }
    },
    callbackUrl: {
      name: "__Secure-authjs.callback-url",
      options: { ...crossSiteCookieOptions }
    },
    csrfToken: {
      // __Host- prefix would block Partitioned in some browsers, drop the prefix
      name: "__Secure-authjs.csrf-token",
      options: { httpOnly: true, ...crossSiteCookieOptions }
    }
  },
  callbacks: {
    async signIn({ user, profile }) {
      const email = user.email ?? profile?.email;
      const allowed = await isEmailAllowed(email);
      console.log("[v0] signIn callback", { email, allowed, allowlistEnv: process.env.BRIEFOPS_BETA_ALLOWLIST });
      return allowed ? true : "/blocked";
    },
    jwt({ token, user, profile }) {
      if (user?.id) token.sub = String(user.id);
      else if (profile?.id) token.sub = String(profile.id);
      if (user?.email) token.email = user.email;
      console.log("[v0] jwt callback", { sub: token.sub, email: token.email, hasUser: Boolean(user) });
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.email ?? "demo-user";
      }
      console.log("[v0] session callback", { userId: session.user?.id, email: session.user?.email });
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
