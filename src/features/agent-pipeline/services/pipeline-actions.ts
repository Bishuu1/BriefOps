"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@infrastructure/auth/session";
import {
  completeRadarRun,
  createRadarRun,
  getRadar,
  getSources,
  markRadarRunRunning,
  updateSourceCheckResult
} from "@infrastructure/db/store";
import { runRadarWorkflowBoundary } from "@infrastructure/workflows/radar-workflow";

export async function runRadar() {
  const userId = await getCurrentUserId();
  const [radar, sources] = await Promise.all([getRadar(userId), getSources(userId)]);
  const activeSources = sources.filter((source) => source.status === "activa");
  const run = await createRadarRun(userId, radar.id, activeSources.length);

  try {
    await markRadarRunRunning(userId, run.id);
    await runRadarWorkflowBoundary(radar, activeSources);
    const checkedAt = new Date().toISOString();
    let errors = 0;

    for (const source of activeSources) {
      const supported =
        source.type === "RSS feed" || source.type === "GitHub repo releases" || source.type === "Fuente manual";
      const error = supported ? null : `${source.type} ingestion is not connected in private beta yet.`;
      if (error) errors += 1;
      await updateSourceCheckResult(userId, source.id, { checkedAt, error });
    }

    await completeRadarRun(userId, run.id, "succeeded", {
      rawItemsFound: Math.max(activeSources.length - errors, 0) * 2,
      signalsCreated: Math.min(Math.max(activeSources.length - errors, 0), 4),
      error: errors > 0 ? `${errors} source${errors === 1 ? "" : "s"} need ingestion setup.` : null
    });
  } catch (error) {
    await completeRadarRun(userId, run.id, "failed", {
      rawItemsFound: 0,
      signalsCreated: 0,
      error: error instanceof Error ? error.message : "Unknown radar run failure"
    });
  }

  revalidatePath("/dashboard");
}
