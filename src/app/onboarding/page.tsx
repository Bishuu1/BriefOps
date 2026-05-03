import { redirect } from "next/navigation";
import { Onboarding } from "@features/onboarding/onboarding";
import { getCurrentUserId } from "@infrastructure/auth/session";
import { ensureUserSeed, getRadar } from "@infrastructure/db/store";

export default async function OnboardingPage() {
  const userId = await getCurrentUserId();
  await ensureUserSeed(userId);
  const radar = await getRadar(userId);

  if (radar.onboardingCompleted) redirect("/dashboard");

  return <Onboarding radar={radar} />;
}
