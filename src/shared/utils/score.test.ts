import { describe, expect, it } from "vitest";
import { calculateSignalScore, clampScore } from "./score";

describe("score utilities", () => {
  it("calculates deterministic weighted signal score", () => {
    expect(
      calculateSignalScore({
        relevance: 96,
        impact: 91,
        actionability: 89,
        novelty: 84,
        urgency: 76,
        confidence: 88
      })
    ).toBe(90);
  });

  it("clamps scores to the 0-100 range", () => {
    expect(clampScore(-3)).toBe(0);
    expect(clampScore(101)).toBe(100);
  });
});
