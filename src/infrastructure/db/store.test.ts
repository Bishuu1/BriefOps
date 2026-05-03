import { afterEach, describe, expect, it } from "vitest";
import { createGeneratedAction, ensureUserSeed, getRadar, getSources } from "./store";

const originalDemo = process.env.BRIEFOPS_ENABLE_DEMO_MODE;
const originalPostgres = process.env.POSTGRES_URL;

describe("store isolation and demo guard", () => {
  afterEach(() => {
    restoreEnv("BRIEFOPS_ENABLE_DEMO_MODE", originalDemo);
    restoreEnv("POSTGRES_URL", originalPostgres);
  });

  it("requires explicit demo mode when Postgres is missing", async () => {
    process.env.BRIEFOPS_ENABLE_DEMO_MODE = "false";
    process.env.POSTGRES_URL = "";

    await expect(getRadar("user-a")).rejects.toThrow("storage is not configured");
  });

  it("seeds data per user in explicit demo mode", async () => {
    process.env.BRIEFOPS_ENABLE_DEMO_MODE = "true";
    process.env.POSTGRES_URL = "";

    await ensureUserSeed("user-a");
    await ensureUserSeed("user-b");

    const [radarA, radarB] = await Promise.all([getRadar("user-a"), getRadar("user-b")]);
    expect(radarA.userId).toBe("user-a");
    expect(radarB.userId).toBe("user-b");
    expect(radarA.id).not.toBe(radarB.id);
  });

  it("does not create an action for another user's signal", async () => {
    process.env.BRIEFOPS_ENABLE_DEMO_MODE = "true";
    process.env.POSTGRES_URL = "";

    const source = (await getSources("user-a"))[0];
    await expect(
      createGeneratedAction("user-b", `${source.radarId}-signal-workflows`, "Technical spike", "Invalid", "Nope")
    ).rejects.toThrow("does not belong to this user");
  });
});

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
