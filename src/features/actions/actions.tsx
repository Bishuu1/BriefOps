import { CheckCircle2 } from "lucide-react";
import { Card } from "@shared/components/card";

export function Actions() {
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
        </div>
      </div>
    </Card>
  );
}
