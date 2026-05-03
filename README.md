# BriefOps

BriefOps is a private-beta Next.js product for an agentic professional radar. The seeded first radar focuses on AI builders and turns technical updates into scored signals, impact explanations, and recommended actions.

## Stack

- Next.js App Router, React 19, TypeScript
- Auth.js with GitHub and Google OAuth
- Email allowlist for private beta access
- Vercel Postgres with normalized per-user data
- AI SDK with OpenAI structured outputs
- Vitest for unit and architecture checks

## Architecture

This repo follows `scope-rule.md`.

- One-feature code lives under `src/features/[feature-name]`.
- Reused code for 2+ features lives in `src/shared`.
- Cross-cutting integrations live in `src/infrastructure`.
- Main feature containers match their feature names, for example `src/features/daily-brief/daily-brief.tsx`.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Local in-memory data is only enabled when `BRIEFOPS_ENABLE_DEMO_MODE=true`. Production should always configure OAuth, `POSTGRES_URL`, and `BRIEFOPS_BETA_ALLOWLIST`.

## Vercel Setup

1. Create a Vercel Postgres database.
2. Run `migrations/0001_private_beta.sql`.
3. Configure:
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `AUTH_TRUST_HOST=true`
   - `POSTGRES_URL`
   - `OPENAI_API_KEY`
   - `BRIEFOPS_BETA_ALLOWLIST`
   - optional `GITHUB_TOKEN`
4. Deploy.

v0 and Vercel share project environment variables when connected. Add these variables in the v0 Vars panel or the Vercel project settings before publishing production changes.

## Scripts

```bash
npm run dev
npm run typecheck
npm run test
npm run build
```
