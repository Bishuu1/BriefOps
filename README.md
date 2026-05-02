# BriefOps

BriefOps is a Next.js MVP for an agentic professional radar. The seeded demo focuses on AI builders and turns technical updates into scored signals, impact explanations, and recommended actions.

## Stack

- Next.js App Router, React 19, TypeScript
- Auth.js with GitHub OAuth
- Vercel Postgres for per-user data
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

If GitHub OAuth variables are not configured, the app opens in demo mode. If Postgres is not configured, it uses in-memory seeded data.

## Vercel Setup

1. Create a Vercel Postgres database.
2. Run `src/infrastructure/db/schema.sql`.
3. Configure:
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
   - `AUTH_TRUST_HOST=true`
   - `POSTGRES_URL`
   - `OPENAI_API_KEY`
   - optional `GITHUB_TOKEN`
4. Deploy.

## Scripts

```bash
npm run dev
npm run typecheck
npm run test
npm run build
```
