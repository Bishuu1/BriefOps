import type { Radar, Source } from "@shared/models/domain";

export async function runRadarWorkflowBoundary(radar: Radar, sources: Source[]) {
  "use server";

  return {
    workflow: "briefops-radar-run",
    radarId: radar.id,
    sourceCount: sources.length,
    steps: ["collect", "normalize", "deduplicate", "classify", "score", "summarize", "impact", "actions", "remember"]
  };
}
