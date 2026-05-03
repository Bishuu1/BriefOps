import { ArrowRight, Github, Radar, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import {
  auth,
  isAuthConfigured,
  isCredentialsAuthConfigured,
  isDemoModeEnabled,
  isGitHubAuthConfigured,
  isGoogleAuthConfigured
} from "@infrastructure/auth/auth";
import {
  signInWithCredentials,
  signInWithGitHub,
  signInWithGoogle
} from "@infrastructure/auth/actions";

type SearchParams = Promise<{ error?: string }>;

export default async function HomePage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const session = isAuthConfigured() ? await auth() : null;
  if (session?.user) redirect("/dashboard");

  const params = (await searchParams) ?? {};
  const errorMessage = params.error
    ? "Invalid email or password. Try again."
    : null;

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
          <section>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm text-slate-600">
              <Sparkles size={15} className="text-mint" />
              Built for AI builders who need decisions, not another feed
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-ink text-balance">
              BriefOps tracks what changed and turns signals into next steps.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Monitor changelogs, docs, releases, papers, and technical sources. The agent
              filters noise, scores impact, explains context, and recommends what to do today.
            </p>

            {isCredentialsAuthConfigured() ? (
              <Card className="mt-7 max-w-md space-y-4 p-5">
                <div>
                  <h2 className="text-base font-semibold text-ink">Sign in to continue</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Use your beta credentials to access the dashboard.
                  </p>
                </div>
                <form action={signInWithCredentials} className="space-y-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium uppercase tracking-wide text-slate-500"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      defaultValue="demo@demo.com"
                      className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="text-xs font-medium uppercase tracking-wide text-slate-500"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
                    />
                  </div>
                  {errorMessage ? (
                    <p className="text-sm text-red-600" role="alert">
                      {errorMessage}
                    </p>
                  ) : null}
                  <Button type="submit" variant="primary" className="h-11 w-full">
                    Sign in <ArrowRight size={17} />
                  </Button>
                </form>

                {isGitHubAuthConfigured() || isGoogleAuthConfigured() ? (
                  <div className="space-y-2 border-t border-line pt-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Or continue with
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {isGitHubAuthConfigured() ? (
                        <form action={signInWithGitHub}>
                          <Button type="submit" variant="secondary" className="h-10 px-3">
                            <Github size={16} /> GitHub
                          </Button>
                        </form>
                      ) : null}
                      {isGoogleAuthConfigured() ? (
                        <form action={signInWithGoogle}>
                          <Button type="submit" variant="secondary" className="h-10 px-3">
                            Google
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </Card>
            ) : (
              <div className="mt-7 flex flex-wrap gap-3">
                {isGitHubAuthConfigured() ? (
                  <form action={signInWithGitHub}>
                    <Button type="submit" variant="primary" className="h-11 px-4">
                      <Github size={17} /> Sign in with GitHub
                    </Button>
                  </form>
                ) : null}
                {isGoogleAuthConfigured() ? (
                  <form action={signInWithGoogle}>
                    <Button type="submit" variant="secondary" className="h-11 px-4">
                      Sign in with Google
                    </Button>
                  </form>
                ) : null}
                {!isAuthConfigured() && isDemoModeEnabled() ? (
                  <a href="/dashboard">
                    <Button type="button" variant="primary" className="h-11 px-4">
                      Open demo mode <ArrowRight size={17} />
                    </Button>
                  </a>
                ) : null}
                {!isAuthConfigured() && !isDemoModeEnabled() ? (
                  <Button type="button" variant="secondary" className="h-11 px-4" disabled>
                    Configure auth to continue
                  </Button>
                ) : null}
              </div>
            )}
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
