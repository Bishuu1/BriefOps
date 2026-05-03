import { sql } from "@infrastructure/db/sql";

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

function envAllowlist() {
  return new Set(
    (process.env.BRIEFOPS_BETA_ALLOWLIST ?? "")
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean)
  );
}

function hasPostgres() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

export async function isEmailAllowed(email: string | null | undefined) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  const configuredEmails = envAllowlist();
  if (configuredEmails.has(normalized)) return true;

  if (!hasPostgres()) {
    return process.env.NODE_ENV !== "production" && configuredEmails.size === 0;
  }

  try {
    const result = await sql<{ email: string }>`
      select email from briefops_allowed_emails where lower(email) = ${normalized} limit 1
    `;
    return (result.rowCount ?? 0) > 0;
  } catch {
    return process.env.NODE_ENV !== "production" && configuredEmails.size === 0;
  }
}
