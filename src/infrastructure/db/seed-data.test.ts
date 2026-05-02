import { describe, expect, it } from "vitest";
import { createSeedRadar, createSeedSignals, createSeedSources } from "./seed-data";

describe("first-login seed data", () => {
  it("creates a per-user AI Builder Radar with sources and signals", () => {
    const radar = createSeedRadar("user-a");
    const sources = createSeedSources("user-a", radar.id);
    const signals = createSeedSignals("user-a", radar.id, sources);

    expect(radar.userId).toBe("user-a");
    expect(radar.name).toBe("AI Builder Radar");
    expect(sources.length).toBeGreaterThan(3);
    expect(signals[0].userId).toBe("user-a");
    expect(signals[0].signalScore).toBeGreaterThan(0);
  });
});
