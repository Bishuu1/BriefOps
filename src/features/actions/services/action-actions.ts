"use server";

import { revalidatePath } from "next/cache";
import { createGeneratedAction, updateSignalStatus } from "@infrastructure/db/store";
import { getCurrentUserId } from "@infrastructure/auth/session";
import type { GeneratedAction } from "@shared/models/domain";

export async function createActionForSignal(formData: FormData) {
  const userId = await getCurrentUserId();
  const signalId = String(formData.get("signalId"));
  const kind = String(formData.get("kind")) as GeneratedAction["kind"];
  const title = String(formData.get("title"));
  const body = String(formData.get("body"));

  await createGeneratedAction(userId, signalId, kind, title, body);
  await updateSignalStatus(userId, signalId, "Convertido en accion");
  revalidatePath("/dashboard");
}
