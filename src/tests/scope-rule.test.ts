import { describe, expect, it } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("scope-rule architecture", () => {
  it("keeps feature containers named after their feature", () => {
    const featuresPath = join(root, "src/features");
    const features = readdirSync(featuresPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const feature of features) {
      expect(existsSync(join(featuresPath, feature, `${feature}.tsx`))).toBe(true);
    }
  });

  it("has explicit shared and infrastructure boundaries", () => {
    expect(existsSync(join(root, "src/shared"))).toBe(true);
    expect(existsSync(join(root, "src/infrastructure"))).toBe(true);
  });
});
