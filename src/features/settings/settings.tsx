import { ShieldCheck } from "lucide-react";
import { Card } from "@shared/components/card";

export function Settings({ email }: { email: string | null | undefined }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck size={18} className="text-mint" />
        <h2 className="text-lg font-semibold text-ink">Settings</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Setting label="Account" value={email ?? "Authenticated user"} />
        <Setting label="Access" value="Private beta allowlist" />
        <Setting label="Execution" value="Manual radar runs" />
      </div>
    </Card>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
