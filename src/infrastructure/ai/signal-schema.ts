import { z } from "zod";

export const signalOutputSchema = z.object({
  type: z.enum([
    "Release",
    "Breaking change",
    "New tool",
    "New model",
    "New paper",
    "Tutorial",
    "Opinion / analysis",
    "Security issue",
    "Business opportunity",
    "Trend",
    "Event",
    "GitHub release",
    "Changelog",
    "Regulatory update",
    "Market update"
  ]),
  summary: z.string().describe("Three concise lines for a technical builder."),
  whyItMatters: z.string(),
  recommendedAction: z.string(),
  scoreExplanation: z.string(),
  scores: z.object({
    relevance: z.number().min(0).max(100),
    novelty: z.number().min(0).max(100),
    impact: z.number().min(0).max(100),
    actionability: z.number().min(0).max(100),
    urgency: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100)
  }),
  tags: z.array(z.string()).min(1).max(6)
});

export type SignalOutput = z.infer<typeof signalOutputSchema>;
