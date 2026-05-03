"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@infrastructure/auth/session";
import {
  createSource,
  deleteSource,
  getRadar,
  getSources,
  updateSource,
  updateSourceStatus
} from "@infrastructure/db/store";
import type { Source, SourceStatus, SourceType } from "@shared/models/domain";

export async function addSource(formData: FormData) {
  const userId = await getCurrentUserId();
  const radar = await getRadar(userId);
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const type = String(formData.get("type") ?? "Blog") as SourceType;

  if (!name || !url) return;
  try {
    new URL(url);
  } catch {
    return;
  }

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
    lastError: null,
    status: "activa"
  };

  await createSource(userId, source);
  revalidatePath("/dashboard");
}

export async function setSourceStatus(formData: FormData) {
  const userId = await getCurrentUserId();
  const sourceId = String(formData.get("sourceId"));
  const status = String(formData.get("status")) as SourceStatus;

  await updateSourceStatus(userId, sourceId, status);
  revalidatePath("/dashboard");
}

export async function saveSource(formData: FormData) {
  const userId = await getCurrentUserId();
  const sourceId = String(formData.get("sourceId"));
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const type = String(formData.get("type") ?? "Blog") as SourceType;

  if (!name || !url) return;
  try {
    new URL(url);
  } catch {
    return;
  }

  const existing = (await getSources(userId)).find((source) => source.id === sourceId);
  if (!existing) return;

  await updateSource(userId, {
    ...existing,
    name,
    url,
    type,
    suggestedFrequency: type === "GitHub repo releases" ? "Daily" : existing.suggestedFrequency,
    lastError: null
  });
  revalidatePath("/dashboard");
}

export async function removeSource(formData: FormData) {
  const userId = await getCurrentUserId();
  const sourceId = String(formData.get("sourceId"));

  await deleteSource(userId, sourceId);
  revalidatePath("/dashboard");
}
