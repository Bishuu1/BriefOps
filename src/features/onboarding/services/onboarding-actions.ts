"use server";

import { redirect } from "next/navigation";
import { getCurrentUserId } from "@infrastructure/auth/session";
import { getRadar, updateRadar } from "@infrastructure/db/store";
import type { OutputType, ProfessionalProfile, RadarGoal, UserLevel } from "@shared/models/domain";

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function completeOnboarding(formData: FormData) {
  const userId = await getCurrentUserId();
  const current = await getRadar(userId);

  await updateRadar(userId, {
    ...current,
    name: String(formData.get("name") ?? current.name),
    profile: String(formData.get("profile") ?? current.profile) as ProfessionalProfile,
    goal: String(formData.get("goal") ?? current.goal) as RadarGoal,
    level: String(formData.get("level") ?? current.level) as UserLevel,
    interests: splitList(formData.get("interests")),
    avoidTopics: splitList(formData.get("avoidTopics")),
    outputTypes: splitList(formData.get("outputTypes")) as OutputType[],
    onboardingCompleted: true
  });

  redirect("/dashboard");
}
