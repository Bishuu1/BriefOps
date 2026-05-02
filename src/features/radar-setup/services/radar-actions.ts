"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@infrastructure/auth/session";
import { getRadar, updateRadar } from "@infrastructure/db/store";
import type { OutputType, RadarGoal, UserLevel } from "@shared/models/domain";

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveRadarContext(formData: FormData) {
  const userId = await getCurrentUserId();
  const current = await getRadar(userId);

  await updateRadar(userId, {
    ...current,
    name: String(formData.get("name") ?? current.name),
    goal: String(formData.get("goal") ?? current.goal) as RadarGoal,
    level: String(formData.get("level") ?? current.level) as UserLevel,
    interests: splitList(formData.get("interests")),
    avoidTopics: splitList(formData.get("avoidTopics")),
    outputTypes: splitList(formData.get("outputTypes")) as OutputType[]
  });

  revalidatePath("/dashboard");
}
