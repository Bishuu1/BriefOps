import { XMLParser } from "fast-xml-parser";
import type { NormalizedItem, Source } from "@shared/models/domain";

export async function collectRssSource(userId: string, radarId: string, source: Source): Promise<NormalizedItem[]> {
  const response = await fetch(source.url, { next: { revalidate: 1800 } });
  if (!response.ok) throw new Error(`RSS fetch failed for ${source.name}`);

  const xml = await response.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const rawItems = parsed.rss?.channel?.item ?? parsed.feed?.entry ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.slice(0, 8).map((item, index) => ({
    id: `${source.id}-rss-${index}-${Date.now()}`,
    userId,
    radarId,
    sourceId: source.id,
    title: item.title?.["#text"] ?? item.title ?? "Untitled RSS item",
    url: item.link?.["@_href"] ?? item.link ?? item.guid ?? source.url,
    author: item.author?.name ?? item.author,
    publishedAt: new Date(item.pubDate ?? item.published ?? item.updated ?? Date.now()).toISOString(),
    excerpt: String(item.description ?? item.summary ?? item.content ?? "").replace(/<[^>]*>/g, "").slice(0, 1200),
    tags: ["rss"],
    sourceType: source.type
  }));
}
