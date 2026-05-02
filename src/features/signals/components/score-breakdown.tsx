import type { ScoreBreakdown } from "@shared/models/domain";

const labels: Array<[keyof ScoreBreakdown, string]> = [
  ["relevance", "Relevance"],
  ["novelty", "Novelty"],
  ["impact", "Impact"],
  ["actionability", "Actionability"],
  ["urgency", "Urgency"],
  ["confidence", "Confidence"]
];

export function ScoreBreakdownList({ scores }: { scores: ScoreBreakdown }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {labels.map(([key, label]) => (
        <div key={key} className="rounded-md border border-line bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{label}</span>
            <span>{scores[key]}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-cobalt" style={{ width: `${scores[key]}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
