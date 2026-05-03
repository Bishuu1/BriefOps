import { afterEach, describe, expect, it } from "vitest";
import { isEmailAllowed } from "./allowlist";

const originalAllowlist = process.env.BRIEFOPS_BETA_ALLOWLIST;
const originalPostgres = process.env.POSTGRES_URL;

describe("beta allowlist", () => {
  afterEach(() => {
    restoreEnv("BRIEFOPS_BETA_ALLOWLIST", originalAllowlist);
    restoreEnv("POSTGRES_URL", originalPostgres);
  });

  it("allows emails configured in env", async () => {
    process.env.BRIEFOPS_BETA_ALLOWLIST = "founder@example.com, beta@example.com";
    process.env.POSTGRES_URL = "";

    await expect(isEmailAllowed("Beta@Example.com")).resolves.toBe(true);
  });

  it("blocks unknown emails without silent demo fallback when an allowlist is configured", async () => {
    process.env.BRIEFOPS_BETA_ALLOWLIST = "founder@example.com";
    process.env.POSTGRES_URL = "";

    await expect(isEmailAllowed("stranger@example.com")).resolves.toBe(false);
  });
});

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
