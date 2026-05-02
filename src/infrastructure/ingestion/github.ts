import type { NormalizedItem, Source } from "@shared/models/domain";

function repoPath(url: string) {
  const parsed = new URL(url);
  return parsed.pathname.replace(/^\//, "").replace(/\/$/, "");
}

export async function collectGitHubReleases(
  userId: string,
  radarId: string,
  source: Source
): Promise<NormalizedItem[]> {
  const response = await fetch(`https://api.github.com/repos/${repoPath(source.url)}/releases`, {
    headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
    next: { revalidate: 1800 }
  });

  if (!response.ok) throw new Error(`GitHub releases fetch failed for ${source.name}`);

  const releases = (await response.json()) as Array<{
    id: number;
    name: string | null;
    tag_name: string;
    html_url: string;
    author?: { login?: string };
    published_at: string | null;
    body: string | null;
  }>;

  return releases.slice(0, 6).map((release) => ({
    id: `${source.id}-release-${release.id}`,
    userId,
    radarId,
    sourceId: source.id,
    title: release.name ?? release.tag_name,
    url: release.html_url,
    author: release.author?.login,
    publishedAt: new Date(release.published_at ?? Date.now()).toISOString(),
    excerpt: release.body?.slice(0, 1200) ?? "GitHub release without release notes.",
    tags: ["github", "release"],
    sourceType: source.type
  }));
}
