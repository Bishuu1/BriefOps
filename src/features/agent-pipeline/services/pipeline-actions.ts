"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@infrastructure/auth/session";
import { getRadar, getSources } from "@infrastructure/db/store";
import { runRadarWorkflowBoundary } from "@infrastructure/workflows/radar-workflow";

export async function runRadar() {
  const userId = await getCurrentUserId();
  const [radar, sources] = await Promise.all([getRadar(userId), getSources(userId)]);
  await runRadarWorkflowBoundary(radar, sources);
  revalidatePath("/dashboard");
}
