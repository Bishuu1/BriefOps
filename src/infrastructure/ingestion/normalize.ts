import type { NormalizedItem, Source } from "@shared/models/domain";

export function normalizeManualContent(
  userId: string,
  radarId: string,
  source: Source,
  content: string
): NormalizedItem {
  const firstLine = content.split("\n").find(Boolean)?.trim() ?? "Manual brief item";

  return {
    id: `${source.id}-manual-${Date.now()}`,
    userId,
    radarId,
    sourceId: source.id,
    title: firstLine.slice(0, 120),
    url: source.url,
    publishedAt: new Date().toISOString(),
    excerpt: content.slice(0, 1200),
    tags: ["manual"],
    sourceType: source.type
  };
}

export function canonicalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url.trim().toLowerCase();
  }
}

export function areLikelyDuplicates(a: Pick<NormalizedItem, "title" | "url">, b: Pick<NormalizedItem, "title" | "url">) {
  if (canonicalizeUrl(a.url) === canonicalizeUrl(b.url)) return true;

  const aWords = new Set(a.title.toLowerCase().split(/\W+/).filter(Boolean));
  const bWords = new Set(b.title.toLowerCase().split(/\W+/).filter(Boolean));
  const overlap = [...aWords].filter((word) => bWords.has(word)).length;
  const denominator = Math.max(aWords.size, bWords.size, 1);

  return overlap / denominator > 0.72;
}
