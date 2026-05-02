import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import type { NormalizedItem, Radar, Signal } from "@shared/models/domain";
import { calculateSignalScore } from "@shared/utils/score";
import { signalOutputSchema } from "./signal-schema";

export async function generateSignalFromItem(
  radar: Radar,
  item: NormalizedItem,
  sourceName: string,
  sourceUrl: string
): Promise<Signal> {
  if (!process.env.OPENAI_API_KEY) {
    const fallbackScores = {
      relevance: 72,
      novelty: 64,
      impact: 68,
      actionability: 61,
      urgency: 42,
      confidence: 58
    };

    return {
      id: `${item.id}-signal`,
      userId: item.userId,
      radarId: item.radarId,
      sourceId: item.sourceId,
      title: item.title,
      sourceName,
      sourceUrl,
      publishedAt: item.publishedAt,
      type: item.sourceType === "GitHub repo releases" ? "GitHub release" : "Changelog",
      status: "Nuevo",
      summary: item.excerpt.slice(0, 260),
      whyItMatters: "This source matched the radar interests, but AI scoring is using fallback mode.",
      recommendedAction: "Review the source manually or configure OPENAI_API_KEY for richer analysis.",
      scoreExplanation: "Fallback scoring is conservative because no OpenAI key is configured.",
      scores: fallbackScores,
      signalScore: calculateSignalScore(fallbackScores),
      citations: [{ label: sourceName, url: item.url || sourceUrl }],
      tags: item.tags
    };
  }

  const { object } = await generateObject({
    model: openai("gpt-4.1-mini"),
    schema: signalOutputSchema,
    prompt: [
      `You are BriefOps, an intelligence agent for professional radars.`,
      `Radar name: ${radar.name}`,
      `Profile: ${radar.profile}`,
      `Goal: ${radar.goal}`,
      `Level: ${radar.level}`,
      `Interests: ${radar.interests.join(", ")}`,
      `Avoid: ${radar.avoidTopics.join(", ")}`,
      `Classify and score this item for the radar.`,
      `Title: ${item.title}`,
      `Source: ${sourceName}`,
      `Published: ${item.publishedAt}`,
      `Excerpt: ${item.excerpt}`
    ].join("\n")
  });

  return {
    id: `${item.id}-signal`,
    userId: item.userId,
    radarId: item.radarId,
    sourceId: item.sourceId,
    title: item.title,
    sourceName,
    sourceUrl,
    publishedAt: item.publishedAt,
    type: object.type,
    status: "Nuevo",
    summary: object.summary,
    whyItMatters: object.whyItMatters,
    recommendedAction: object.recommendedAction,
    scoreExplanation: object.scoreExplanation,
    scores: object.scores,
    signalScore: calculateSignalScore(object.scores),
    citations: [{ label: sourceName, url: item.url || sourceUrl }],
    tags: object.tags
  };
}
