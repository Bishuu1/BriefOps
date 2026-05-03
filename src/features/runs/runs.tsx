import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { RadarRun } from "@shared/models/domain";
import { Badge } from "@shared/components/badge";
import { Card } from "@shared/components/card";
import { formatShortDate } from "@shared/utils/date";

export function Runs({ runs }: { runs: RadarRun[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Activity size={18} className="text-cobalt" />
        <h2 className="text-lg font-semibold text-ink">Runs</h2>
      </div>

      {runs.length === 0 ? (
        <div className="rounded-md border border-dashed border-line bg-paper p-4 text-sm text-slate-600">
          No radar runs yet. Run your radar manually to create the first operational record.
        </div>
      ) : (
        <div className="grid gap-3">
          {runs.slice(0, 5).map((run) => (
            <div key={run.id} className="rounded-md border border-line bg-paper p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <RunIcon status={run.status} />
                  <p className="text-sm font-semibold text-ink">{formatShortDate(run.startedAt)}</p>
                </div>
                <Badge tone={run.status === "succeeded" ? "green" : run.status === "failed" ? "red" : "orange"}>
                  {run.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {run.sourcesChecked} sources checked · {run.rawItemsFound} items · {run.signalsCreated} signals
              </p>
              {run.error ? <p className="mt-2 text-sm text-red-600">{run.error}</p> : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RunIcon({ status }: { status: RadarRun["status"] }) {
  if (status === "succeeded") return <CheckCircle2 size={17} className="text-mint" />;
  if (status === "failed") return <AlertTriangle size={17} className="text-red-600" />;
  return <Clock size={17} className="text-orange-600" />;
}
