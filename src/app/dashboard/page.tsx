import { LogOut, Radar } from "lucide-react";
import { redirect } from "next/navigation";
import { AgentPipeline } from "@features/agent-pipeline/agent-pipeline";
import { DailyBrief } from "@features/daily-brief/daily-brief";
import { RadarSetup } from "@features/radar-setup/radar-setup";
import { Signals } from "@features/signals/signals";
import { Sources } from "@features/sources/sources";
import { auth, isAuthConfigured } from "@infrastructure/auth/auth";
import { signOutUser } from "@infrastructure/auth/actions";
import { getCurrentUserId } from "@infrastructure/auth/session";
import { ensureUserSeed, getRadar, getSignals, getSources } from "@infrastructure/db/store";
import { Button } from "@shared/components/button";

export default async function DashboardPage() {
  const session = isAuthConfigured() ? await auth() : null;
  if (isAuthConfigured() && !session?.user) redirect("/");

  const userId = await getCurrentUserId();
  await ensureUserSeed(userId);
  const [radar, sources, signals] = await Promise.all([getRadar(userId), getSources(userId), getSignals(userId)]);

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-white">
              <Radar size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">BriefOps</p>
              <p className="text-xs text-slate-500">{session?.user?.email ?? "Demo mode"}</p>
            </div>
          </div>
          {isAuthConfigured() ? (
            <form action={signOutUser}>
              <Button type="submit" variant="ghost">
                <LogOut size={16} /> Sign out
              </Button>
            </form>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6">
        <DailyBrief radar={radar} signals={signals} />
        <AgentPipeline />
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <RadarSetup radar={radar} />
          <Sources sources={sources} />
        </div>
        <section>
          <div className="mb-3">
            <h2 className="text-xl font-semibold text-ink">Signal Cards</h2>
            <p className="mt-1 text-sm text-slate-600">
              Each card explains the score, the impact, and the next step for this radar.
            </p>
          </div>
          <Signals signals={signals} />
        </section>
      </div>
    </main>
  );
}
