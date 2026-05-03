import { CheckCircle2 } from "lucide-react";
import type { GeneratedAction } from "@shared/models/domain";
import { Card } from "@shared/components/card";

export function Actions({ actions = [] }: { actions?: GeneratedAction[] }) {
  return (
    <Card className="bg-ink text-white">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 text-emerald-300" size={20} />
        <div>
          <h2 className="text-base font-semibold">Recommended next action</h2>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Run a focused spike on durable agent execution: model BriefOps radar runs as workflow
            steps, keep scoring deterministic, and validate one source-to-signal path end to end.
          </p>
          {actions.length > 0 ? (
            <div className="mt-4 space-y-2">
              {actions.slice(0, 3).map((action) => (
                <div key={action.id} className="rounded-md bg-white/10 p-2 text-sm text-slate-100">
                  {action.title}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
