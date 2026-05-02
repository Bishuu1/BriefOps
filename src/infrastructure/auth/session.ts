import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "./auth";
import { demoUserId } from "@infrastructure/db/seed-data";

export async function getCurrentUserId() {
  if (!isAuthConfigured()) return demoUserId;

  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return session.user.id;
}
