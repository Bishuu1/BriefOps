import { DatabaseZap, Pause, Play, Trash2 } from "lucide-react";
import type { Source } from "@shared/models/domain";
import { Badge } from "@shared/components/badge";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import { formatShortDate } from "@shared/utils/date";
import { addSource, removeSource, saveSource, setSourceStatus } from "./services/source-actions";

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
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id} className="border-t border-line">
                <td className="px-3 py-3">
                  <form id={`source-${source.id}`} action={saveSource} className="grid gap-2">
                    <input type="hidden" name="sourceId" value={source.id} />
                    <input
                      name="name"
                      defaultValue={source.name}
                      className="h-9 rounded-md border border-line bg-white px-2 text-sm font-medium text-ink outline-none focus:border-cobalt"
                    />
                    <input
                      name="url"
                      defaultValue={source.url}
                      className="h-9 rounded-md border border-line bg-white px-2 text-xs text-slate-600 outline-none focus:border-cobalt"
                    />
                  </form>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  <select
                    form={`source-${source.id}`}
                    name="type"
                    defaultValue={source.type}
                    className="h-9 rounded-md border border-line bg-white px-2 text-sm outline-none focus:border-cobalt"
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
                </td>
                <td className="px-3 py-3 text-slate-600">{source.suggestedFrequency}</td>
                <td className="px-3 py-3 text-slate-600">{source.trustScore}/100</td>
                <td className="px-3 py-3 text-slate-600">{formatShortDate(source.lastCheckedAt)}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1">
                    <Badge tone={source.status === "activa" ? "green" : "neutral"}>{source.status}</Badge>
                    {source.lastError ? (
                      <span className="max-w-[260px] text-xs text-red-600">{source.lastError}</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" form={`source-${source.id}`} variant="secondary">
                      Save
                    </Button>
                    <form action={setSourceStatus}>
                      <input type="hidden" name="sourceId" value={source.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={source.status === "activa" ? "pausada" : "activa"}
                      />
                      <Button type="submit" variant="ghost">
                        {source.status === "activa" ? <Pause size={14} /> : <Play size={14} />}
                        {source.status === "activa" ? "Pause" : "Resume"}
                      </Button>
                    </form>
                    <form action={removeSource}>
                      <input type="hidden" name="sourceId" value={source.id} />
                      <Button type="submit" variant="danger">
                        <Trash2 size={14} /> Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
