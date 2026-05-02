import { DatabaseZap } from "lucide-react";
import type { Source } from "@shared/models/domain";
import { Badge } from "@shared/components/badge";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import { formatShortDate } from "@shared/utils/date";
import { addSource } from "./services/source-actions";

export function Sources({ sources }: { sources: Source[] }) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DatabaseZap size={18} className="text-cobalt" />
          <h2 className="text-lg font-semibold text-ink">Sources</h2>
        </div>
        <Badge tone="green">{sources.filter((source) => source.status === "activa").length} active</Badge>
      </div>

      <form action={addSource} className="mb-4 grid gap-3 rounded-md border border-line bg-paper p-3 lg:grid-cols-[1fr_1.4fr_0.8fr_auto]">
        <input
          name="name"
          placeholder="Source name"
          className="h-10 rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cobalt"
        />
        <input
          name="url"
          placeholder="https://..."
          className="h-10 rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cobalt"
        />
        <select
          name="type"
          defaultValue="Blog"
          className="h-10 rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cobalt"
        >
          {[
            "RSS feed",
            "Blog",
            "Changelog",
            "GitHub repo releases",
            "Docs oficiales",
            "Paper / arXiv",
            "Newsletter",
            "Fuente manual"
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <Button type="submit" variant="primary">Add source</Button>
      </form>

      <div className="overflow-hidden rounded-md border border-line">
        <table className="w-full min-w-[760px] border-collapse bg-white text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Frequency</th>
              <th className="px-3 py-3">Trust</th>
              <th className="px-3 py-3">Last review</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id} className="border-t border-line">
                <td className="px-3 py-3">
                  <a href={source.url} className="font-medium text-ink hover:text-cobalt" target="_blank" rel="noreferrer">
                    {source.name}
                  </a>
                </td>
                <td className="px-3 py-3 text-slate-600">{source.type}</td>
                <td className="px-3 py-3 text-slate-600">{source.suggestedFrequency}</td>
                <td className="px-3 py-3 text-slate-600">{source.trustScore}/100</td>
                <td className="px-3 py-3 text-slate-600">{formatShortDate(source.lastCheckedAt)}</td>
                <td className="px-3 py-3">
                  <Badge tone={source.status === "activa" ? "green" : "neutral"}>{source.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
