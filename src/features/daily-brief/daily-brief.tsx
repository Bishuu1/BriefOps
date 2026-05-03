import { ArrowRight, Clock, ShieldAlert, Sparkles } from "lucide-react";
import type { GeneratedAction, Radar, RadarRun, Signal, Source } from "@shared/models/domain";
import { Badge } from "@shared/components/badge";
import { Card } from "@shared/components/card";
import { ScorePill } from "@shared/components/score-pill";
import { Actions } from "@features/actions/actions";
import { BriefSection } from "./components/brief-section";

export function DailyBrief({
  radar,
  signals,
  sources = [],
  actions = [],
  runs = []
}: {
  radar: Radar;
  signals: Signal[];
  sources?: Source[];
  actions?: GeneratedAction[];
  runs?: RadarRun[];
}) {
  const topSignals = signals.slice(0, 3);
  const waitSignals = signals.filter((signal) => signal.signalScore < 75).slice(0, 3);
  const risk =
    signals.find((signal) => signal.type === "Breaking change" || signal.type === "Security issue") ??
    topSignals[1] ??
    topSignals[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone="green">{radar.profile}</Badge>
            <Badge>{radar.level}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Today&apos;s Brief</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            BriefOps filtered today&apos;s AI/software updates for <strong>{radar.name}</strong> and
            turned them into decisions, not another feed.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-white px-4 py-3 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Last run</p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {runs[0]?.finishedAt ? new Date(runs[0].finishedAt).toLocaleString() : "No run yet"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-mint" />
            <h2 className="text-lg font-semibold text-ink">What changed?</h2>
          </div>
          {topSignals.length === 0 ? (
            <div className="rounded-md border border-dashed border-line bg-paper p-4 text-sm text-slate-600">
              No important updates yet. Add sources, finish onboarding, and run your radar manually.
            </div>
          ) : (
            <div className="grid gap-3">
              {topSignals.map((signal) => (
                <div key={signal.id} className="rounded-md border border-line p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-medium text-ink">{signal.title}</h3>
                    <ScorePill value={signal.signalScore} label="Score" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{signal.summary}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Actions actions={actions} />
          <Card>
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-ember" />
              <h2 className="text-base font-semibold text-ink">Risk or breaking change</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {risk?.whyItMatters ?? "No risk signal detected in the latest brief."}
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <BriefSection title="Why it matters">
            {topSignals[0]?.whyItMatters ?? "No high-priority signals yet."}
          </BriefSection>
        </Card>
        <Card>
          <BriefSection title="Source coverage">
            {sources.filter((source) => source.status === "activa").length} active sources ·{" "}
            {sources.filter((source) => source.lastError).length} sources with errors · {actions.length} saved
            actions
          </BriefSection>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Clock size={17} className="text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What can wait</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {waitSignals.length === 0 ? (
              <li>No low-priority updates waiting.</li>
            ) : null}
            {waitSignals.map((signal) => (
              <li key={signal.id} className="flex gap-2">
                <ArrowRight className="mt-0.5 shrink-0 text-slate-400" size={15} />
                <span>{signal.title}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
