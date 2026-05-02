import type { ScoreBreakdown } from "@shared/models/domain";

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateSignalScore(scores: ScoreBreakdown) {
  return clampScore(
    scores.relevance * 0.3 +
      scores.impact * 0.25 +
      scores.actionability * 0.2 +
      scores.novelty * 0.15 +
      scores.urgency * 0.1
  );
}
