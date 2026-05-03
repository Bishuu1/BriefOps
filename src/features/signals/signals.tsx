import type { Signal } from "@shared/models/domain";
import { SignalCard } from "./components/signal-card";

export function Signals({ signals }: { signals: Signal[] }) {
  if (signals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white p-5 text-sm text-slate-600">
        No signal cards yet. Run your radar after adding sources to generate scored signals.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {signals.map((signal) => (
        <SignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  );
}
