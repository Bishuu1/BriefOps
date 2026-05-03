import { describe, expect, it } from "vitest";
import type { Source } from "@shared/models/domain";
import { areLikelyDuplicates, canonicalizeUrl, normalizeManualContent } from "./normalize";

const source: Source = {
  id: "source-1",
  userId: "user-1",
  radarId: "radar-1",
  name: "Manual",
  url: "https://example.com",
  type: "Fuente manual",
  suggestedFrequency: "Manual",
  trustScore: 70,
  lastCheckedAt: null,
  lastError: null,
  status: "activa"
};

describe("ingestion normalization", () => {
  it("normalizes pasted manual content", () => {
    const item = normalizeManualContent("user-1", "radar-1", source, "New MCP server released\nDetails");

    expect(item.title).toBe("New MCP server released");
    expect(item.sourceType).toBe("Fuente manual");
  });

  it("canonicalizes tracking URLs", () => {
    expect(canonicalizeUrl("https://example.com/post/?utm_source=x#top")).toBe("https://example.com/post");
  });

  it("detects likely duplicate titles", () => {
    expect(
      areLikelyDuplicates(
        { title: "Vercel Workflows durable agent steps", url: "https://a.test/1" },
        { title: "Vercel Workflows adds durable agent steps", url: "https://b.test/2" }
      )
    ).toBe(true);
  });
});
