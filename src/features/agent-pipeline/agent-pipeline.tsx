import { Bot, CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { PipelineStep } from "@shared/models/domain";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import { pipelineSteps } from "@infrastructure/db/seed-data";
import { runRadar } from "./services/pipeline-actions";

export function AgentPipeline({ steps = pipelineSteps }: { steps?: PipelineStep[] }) {
  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-cobalt" />
          <h2 className="text-lg font-semibold text-ink">Agent Pipeline</h2>
        </div>
        <form action={runRadar}>
          <Button type="submit" variant="primary">Run radar</Button>
        </form>
      </div>

      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.id} className="relative rounded-md border border-line bg-paper p-3">
            <div className="flex items-start gap-3">
              <StepIcon status={step.status} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {index + 1}. {step.name}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{step.description}</p>
                <p className="mt-2 text-xs text-slate-500">{step.output}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function StepIcon({ status }: { status: PipelineStep["status"] }) {
  if (status === "complete") return <CheckCircle2 className="mt-0.5 shrink-0 text-mint" size={18} />;
  if (status === "running") return <Loader2 className="mt-0.5 shrink-0 text-cobalt" size={18} />;
  return <Circle className="mt-0.5 shrink-0 text-slate-400" size={18} />;
}
