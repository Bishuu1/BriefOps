import { Target } from "lucide-react";
import type { Radar } from "@shared/models/domain";
import { Badge } from "@shared/components/badge";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import { saveRadarContext } from "./services/radar-actions";

export function RadarSetup({ radar }: { radar: Radar }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-cobalt" />
        <h2 className="text-lg font-semibold text-ink">Radar Setup</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Radar name" value={radar.name} />
        <Field label="Profile" value={radar.profile} />
        <Field label="Goal" value={radar.goal} />
        <Field label="Level" value={radar.level} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TagGroup title="Interests" items={radar.interests} tone="blue" />
        <TagGroup title="Avoid" items={radar.avoidTopics} tone="orange" />
        <TagGroup title="Outputs" items={radar.outputTypes} tone="green" />
      </div>

      <form action={saveRadarContext} className="grid gap-3 border-t border-line pt-4 lg:grid-cols-2">
        <Input label="Radar name" name="name" defaultValue={radar.name} />
        <Select label="Goal" name="goal" defaultValue={radar.goal} options={[
          "Mantenerme actualizado",
          "Detectar oportunidades",
          "Encontrar herramientas para probar",
          "Generar contenido",
          "Preparar decisiones de negocio"
        ]} />
        <Select label="Level" name="level" defaultValue={radar.level} options={[
          "Principiante",
          "Intermedio",
          "Avanzado",
          "Experto"
        ]} />
        <Input label="Output types" name="outputTypes" defaultValue={radar.outputTypes.join(", ")} />
        <Textarea label="Interests" name="interests" defaultValue={radar.interests.join(", ")} />
        <Textarea label="Avoid topics" name="avoidTopics" defaultValue={radar.avoidTopics.join(", ")} />
        <div className="lg:col-span-2">
          <Button type="submit" variant="primary">Save radar context</Button>
        </div>
      </form>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function Input({
  label,
  name,
  defaultValue
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1 h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cobalt"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}

function TagGroup({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "blue" | "orange" | "green";
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} tone={tone}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
