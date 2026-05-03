import { ShieldAlert } from "lucide-react";
import { Card } from "@shared/components/card";

export default function BlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-10">
      <Card className="max-w-lg space-y-3 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-red-50 text-red-700">
          <ShieldAlert size={22} />
        </div>
        <h1 className="text-2xl font-semibold text-ink">Private beta access required</h1>
        <p className="text-sm leading-6 text-slate-600">
          BriefOps is currently invite-only. Use an allowlisted email, or ask the workspace owner
          to add your email to <code className="rounded bg-slate-100 px-1">BRIEFOPS_BETA_ALLOWLIST</code>.
        </p>
      </Card>
    </main>
  );
}
