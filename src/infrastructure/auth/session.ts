import { redirect } from "next/navigation";
import { auth, isAuthConfigured, isDemoModeEnabled } from "./auth";
import { demoUserId } from "@infrastructure/db/seed-data";

export async function getCurrentUserId() {
  if (!isAuthConfigured() && isDemoModeEnabled()) return demoUserId;
  if (!isAuthConfigured()) redirect("/");

  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return session.user.id;
}
