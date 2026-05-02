import { Bookmark, CircleSlash, FileText, FlaskConical, Linkedin, MessageSquare, Zap } from "lucide-react";
import type { Signal } from "@shared/models/domain";
import { Badge } from "@shared/components/badge";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import { ScorePill } from "@shared/components/score-pill";
import { formatShortDate } from "@shared/utils/date";
import { createActionForSignal } from "@features/actions/services/action-actions";
import { setSignalStatus } from "@features/signals/services/signal-actions";
import { ScoreBreakdownList } from "./score-breakdown";

export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="blue">{signal.type}</Badge>
            <Badge>{signal.status}</Badge>
            <span className="text-xs text-slate-500">
              {signal.sourceName} · {formatShortDate(signal.publishedAt)}
            </span>
          </div>
          <h3 className="text-lg font-semibold leading-snug text-ink">{signal.title}</h3>
        </div>
        <ScorePill value={signal.signalScore} />
      </div>

      <p className="text-sm leading-6 text-slate-700">{signal.summary}</p>

      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why it matters</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{signal.whyItMatters}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What to do</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{signal.recommendedAction}</p>
        </div>
      </div>

      <ScoreBreakdownList scores={signal.scores} />

      <div className="rounded-md border border-line bg-paper p-3 text-sm text-slate-700">
        {signal.scoreExplanation}
      </div>

      <div className="flex flex-wrap gap-2">
        {signal.citations.map((citation) => (
          <a
            key={citation.url}
            href={citation.url}
            className="text-sm font-medium text-cobalt hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {citation.label}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <form action={setSignalStatus}>
          <input type="hidden" name="signalId" value={signal.id} />
          <input type="hidden" name="status" value="Guardado" />
          <Button type="submit">
            <Bookmark size={15} /> Save
          </Button>
        </form>
        <form action={setSignalStatus}>
          <input type="hidden" name="signalId" value={signal.id} />
          <input type="hidden" name="status" value="Ignorado" />
          <Button type="submit" variant="ghost">
            <CircleSlash size={15} /> Ignore
          </Button>
        </form>
        <form action={createActionForSignal}>
          <input type="hidden" name="signalId" value={signal.id} />
          <input type="hidden" name="kind" value="Technical spike" />
          <input type="hidden" name="title" value={`Spike: ${signal.title}`} />
          <input type="hidden" name="body" value={signal.recommendedAction} />
          <Button type="submit" variant="primary">
            <Zap size={15} /> Create action
          </Button>
        </form>
        <Button type="button" variant="secondary">
          <MessageSquare size={15} /> Generate Slack update
        </Button>
        <Button type="button" variant="secondary">
          <Linkedin size={15} /> Generate LinkedIn post
        </Button>
        <Button type="button" variant="secondary">
          <FlaskConical size={15} /> Generate technical spike
        </Button>
        <Button type="button" variant="ghost">
          <FileText size={15} /> Explain like I&apos;m busy
        </Button>
      </div>
    </Card>
  );
}
