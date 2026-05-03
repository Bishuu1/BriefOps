import type { Radar } from "@shared/models/domain";
import { Button } from "@shared/components/button";
import { Card } from "@shared/components/card";
import { completeOnboarding } from "./services/onboarding-actions";

export function Onboarding({ radar }: { radar: Radar }) {
  return (
    <main className="min-h-screen bg-paper px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-cobalt">BriefOps private beta</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Set up your first radar</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We created the AI Builder Radar as a starting point. Tune it once, then BriefOps will
            use this context for scoring, summarization, and recommended actions.
          </p>
        </div>

        <Card>
          <form action={completeOnboarding} className="grid gap-4">
            <Field label="Radar name" name="name" defaultValue={radar.name} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Profile"
                name="profile"
                defaultValue={radar.profile}
                options={["Developer / AI Engineer", "Chef", "Contador", "Abogado", "Marketer", "Otro"]}
              />
              <Select
                label="Goal"
                name="goal"
                defaultValue={radar.goal}
                options={[
                  "Mantenerme actualizado",
                  "Detectar oportunidades",
                  "Encontrar herramientas para probar",
                  "Generar contenido",
                  "Preparar decisiones de negocio"
                ]}
              />
              <Select
                label="Level"
                name="level"
                defaultValue={radar.level}
                options={["Principiante", "Intermedio", "Avanzado", "Experto"]}
              />
            </div>
            <Textarea label="Interests" name="interests" defaultValue={radar.interests.join(", ")} />
            <Textarea label="Avoid topics" name="avoidTopics" defaultValue={radar.avoidTopics.join(", ")} />
            <Field label="Output types" name="outputTypes" defaultValue={radar.outputTypes.join(", ")} />
            <Button type="submit" variant="primary" className="h-11">
              Finish setup
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
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

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={4}
        className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}
