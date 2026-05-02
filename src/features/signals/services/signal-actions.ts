"use server";

import { revalidatePath } from "next/cache";
import { updateSignalStatus } from "@infrastructure/db/store";
import { getCurrentUserId } from "@infrastructure/auth/session";
import type { SignalStatus } from "@shared/models/domain";

export async function setSignalStatus(formData: FormData) {
  const userId = await getCurrentUserId();
  const signalId = String(formData.get("signalId"));
  const status = String(formData.get("status")) as SignalStatus;

  await updateSignalStatus(userId, signalId, status);
  revalidatePath("/dashboard");
}
