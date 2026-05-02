import { ArrowRight, Github, Radar, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import { auth, isAuthConfigured } from "@infrastructure/auth/auth";
import { signInWithGitHub } from "@infrastructure/auth/actions";

export default async function HomePage() {
  const session = isAuthConfigured() ? await auth() : null;
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
          <section>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm text-slate-600">
              <Sparkles size={15} className="text-mint" />
              Built for AI builders who need decisions, not another feed
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-ink">
              BriefOps tracks what changed and turns signals into next steps.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Monitor changelogs, docs, releases, papers, and technical sources. The agent
              filters noise, scores impact, explains context, and recommends what to do today.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {isAuthConfigured() ? (
                <form action={signInWithGitHub}>
                  <Button type="submit" variant="primary" className="h-11 px-4">
                    <Github size={17} /> Sign in with GitHub
                  </Button>
                </form>
              ) : (
                <a href="/dashboard">
                  <Button type="button" variant="primary" className="h-11 px-4">
                    Open demo mode <ArrowRight size={17} />
                  </Button>
                </a>
              )}
            </div>
          </section>

          <Card className="space-y-4 p-5">
            <div className="flex items-center gap-2">
              <Radar size={19} className="text-cobalt" />
              <h2 className="text-lg font-semibold text-ink">AI Builder Radar</h2>
            </div>
            {[
              "Vercel Workflows: test as durable agent runtime",
              "AI SDK structured outputs: use for signal schemas",
              "Model update: rerun coding-agent evals before switching defaults"
            ].map((item, index) => (
              <div key={item} className="rounded-md border border-line bg-paper p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Signal {index + 1}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{item}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </main>
  );
}
