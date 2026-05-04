import { Pool, type QueryResultRow } from "pg";

// Drop-in replacement for `@vercel/postgres`'s `sql` tagged template.
//
// Why: `@vercel/postgres` is built on Neon's serverless driver and assumes a Neon
// HTTP endpoint. With Supabase the connection string points at Supabase's PgBouncer
// pooler (`*.pooler.supabase.com`), which the Neon driver cannot reach — it tries
// to rewrite the host to `api.pooler.supabase.com` and DNS fails.
//
// This wrapper uses node-postgres (`pg`) directly, which is the standard driver
// for Supabase pooler connections. It exposes the same tagged-template ergonomics
// the rest of the codebase already uses, so no call sites need to change.
//
// Notes:
//   - Supabase pooler runs in *transaction mode* on port 6543. Unnamed extended
//     queries (which `pg.query(text, values)` issues) are supported there, so we
//     don't need to disable parameter binding.
//   - We keep a single Pool per Node process (cached on globalThis) so repeated
//     server actions / RSC renders don't blow through the pgbouncer connection
//     budget.

const globalForPool = globalThis as unknown as { __briefopsPgPool?: Pool };

function getPool(): Pool {
  if (globalForPool.__briefopsPgPool) return globalForPool.__briefopsPgPool;

  const connectionString = process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL;
  if (!connectionString) {
    throw new Error(
      "BriefOps: POSTGRES_URL is not set. Connect Supabase (or another Postgres) and redeploy."
    );
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    // Supabase certs are valid; sslmode=require is honored from the connection string.
    ssl: { rejectUnauthorized: false }
  });

  globalForPool.__briefopsPgPool = pool;
  return pool;
}

export async function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const text = strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ""),
    ""
  );
  const result = await getPool().query<T>(text, values as unknown[]);
  return { rows: result.rows, rowCount: result.rowCount ?? 0 };
}
