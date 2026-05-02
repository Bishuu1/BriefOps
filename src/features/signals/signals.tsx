import type { Signal } from "@shared/models/domain";
import { SignalCard } from "./components/signal-card";

export function Signals({ signals }: { signals: Signal[] }) {
  return (
    <div className="space-y-4">
      {signals.map((signal) => (
        <SignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  );
}
