import { describe, expect, it } from "vitest";
import { signalOutputSchema } from "./signal-schema";

describe("signal output schema", () => {
  it("validates structured signal output", () => {
    const result = signalOutputSchema.safeParse({
      type: "Release",
      summary: "A concise summary",
      whyItMatters: "It affects agent builders.",
      recommendedAction: "Run a spike.",
      scoreExplanation: "High relevance and actionability.",
      scores: {
        relevance: 90,
        novelty: 75,
        impact: 88,
        actionability: 82,
        urgency: 65,
        confidence: 80
      },
      tags: ["agents"]
    });

    expect(result.success).toBe(true);
  });
});
