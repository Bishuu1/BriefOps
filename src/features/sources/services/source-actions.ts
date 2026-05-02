"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@infrastructure/auth/session";
import { createSource, getRadar } from "@infrastructure/db/store";
import type { Source, SourceType } from "@shared/models/domain";

export async function addSource(formData: FormData) {
  const userId = await getCurrentUserId();
  const radar = await getRadar(userId);
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const type = String(formData.get("type") ?? "Blog") as SourceType;

  if (!name || !url) return;

  const source: Source = {
    id: `${radar.id}-source-${Date.now()}`,
    userId,
    radarId: radar.id,
    name,
    url,
    type,
    suggestedFrequency: type === "GitHub repo releases" ? "Daily" : "Twice weekly",
    trustScore: type === "Fuente manual" ? 70 : 82,
    lastCheckedAt: null,
    status: "activa"
  };

  await createSource(userId, source);
  revalidatePath("/dashboard");
}
