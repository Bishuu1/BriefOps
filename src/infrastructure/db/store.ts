import { sql } from "@vercel/postgres";
import type { GeneratedAction, Radar, Signal, SignalStatus, Source } from "@shared/models/domain";
import { createSeedRadar, createSeedSignals, createSeedSources, demoUserId } from "./seed-data";

type UserData = {
  radar: Radar;
  sources: Source[];
  signals: Signal[];
  actions: GeneratedAction[];
};

const memoryStore = new Map<string, UserData>();

function hasPostgres() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

function now() {
  return new Date().toISOString();
}

function seedMemoryUser(userId: string) {
  const existing = memoryStore.get(userId);
  if (existing) return existing;

  const radar = createSeedRadar(userId);
  const sources = createSeedSources(userId, radar.id);
  const signals = createSeedSignals(userId, radar.id, sources);
  const data = { radar, sources, signals, actions: [] };
  memoryStore.set(userId, data);
  return data;
}

async function ensureSchema() {
  if (!hasPostgres()) return;

  await sql`
    create table if not exists briefops_radars (
      id text primary key,
      user_id text not null,
      payload jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_sources (
      id text primary key,
      user_id text not null,
      radar_id text not null,
      payload jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_signals (
      id text primary key,
      user_id text not null,
      radar_id text not null,
      payload jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_actions (
      id text primary key,
      user_id text not null,
      signal_id text not null,
      payload jsonb not null,
      created_at timestamptz not null default now()
    )
  `;
}

async function seedPostgresUser(userId: string) {
  await ensureSchema();

  const existing = await sql<{ id: string }>`
    select id from briefops_radars where user_id = ${userId} limit 1
  `;

  if ((existing.rowCount ?? 0) > 0) return;

  const radar = createSeedRadar(userId);
  const sources = createSeedSources(userId, radar.id);
  const signals = createSeedSignals(userId, radar.id, sources);

  await sql`
    insert into briefops_radars (id, user_id, payload)
    values (${radar.id}, ${userId}, ${JSON.stringify(radar)}::jsonb)
  `;

  for (const source of sources) {
    await sql`
      insert into briefops_sources (id, user_id, radar_id, payload)
      values (${source.id}, ${userId}, ${radar.id}, ${JSON.stringify(source)}::jsonb)
    `;
  }

  for (const signal of signals) {
    await sql`
      insert into briefops_signals (id, user_id, radar_id, payload)
      values (${signal.id}, ${userId}, ${radar.id}, ${JSON.stringify(signal)}::jsonb)
    `;
  }
}

export async function ensureUserSeed(userId = demoUserId) {
  if (!hasPostgres()) {
    seedMemoryUser(userId);
    return;
  }

  await seedPostgresUser(userId);
}

export async function getRadar(userId = demoUserId): Promise<Radar> {
  if (!hasPostgres()) return seedMemoryUser(userId).radar;

  await ensureUserSeed(userId);
  const result = await sql<{ payload: Radar }>`
    select payload from briefops_radars where user_id = ${userId} limit 1
  `;
  return result.rows[0].payload;
}

export async function updateRadar(userId: string, nextRadar: Radar) {
  const payload = { ...nextRadar, userId, updatedAt: now() };

  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.radar = payload;
    memoryStore.set(userId, data);
    return payload;
  }

  await ensureSchema();
  await sql`
    update briefops_radars
    set payload = ${JSON.stringify(payload)}::jsonb, updated_at = now()
    where user_id = ${userId} and id = ${nextRadar.id}
  `;
  return payload;
}

export async function getSources(userId = demoUserId): Promise<Source[]> {
  if (!hasPostgres()) return seedMemoryUser(userId).sources;

  await ensureUserSeed(userId);
  const result = await sql<{ payload: Source }>`
    select payload from briefops_sources where user_id = ${userId} order by id
  `;
  return result.rows.map((row) => row.payload);
}

export async function createSource(userId: string, source: Source) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.sources = [{ ...source, userId }, ...data.sources];
    memoryStore.set(userId, data);
    return source;
  }

  await ensureSchema();
  await sql`
    insert into briefops_sources (id, user_id, radar_id, payload)
    values (${source.id}, ${userId}, ${source.radarId}, ${JSON.stringify(source)}::jsonb)
  `;
  return source;
}

export async function getSignals(userId = demoUserId): Promise<Signal[]> {
  if (!hasPostgres()) return seedMemoryUser(userId).signals;

  await ensureUserSeed(userId);
  const result = await sql<{ payload: Signal }>`
    select payload from briefops_signals where user_id = ${userId}
  `;
  return result.rows
    .map((row) => row.payload)
    .sort((a, b) => b.signalScore - a.signalScore || +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function updateSignalStatus(userId: string, signalId: string, status: SignalStatus) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.signals = data.signals.map((signal) =>
      signal.id === signalId ? { ...signal, status } : signal
    );
    memoryStore.set(userId, data);
    return;
  }

  const signals = await getSignals(userId);
  const signal = signals.find((item) => item.id === signalId);
  if (!signal) return;

  const payload = { ...signal, status };
  await sql`
    update briefops_signals
    set payload = ${JSON.stringify(payload)}::jsonb, updated_at = now()
    where user_id = ${userId} and id = ${signalId}
  `;
}

export async function createGeneratedAction(
  userId: string,
  signalId: string,
  kind: GeneratedAction["kind"],
  title: string,
  body: string
) {
  const action: GeneratedAction = {
    id: `${signalId}-${kind.toLowerCase().replaceAll(" ", "-")}-${Date.now()}`,
    userId,
    signalId,
    kind,
    title,
    body,
    createdAt: now()
  };

  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.actions = [action, ...data.actions];
    memoryStore.set(userId, data);
    return action;
  }

  await ensureSchema();
  await sql`
    insert into briefops_actions (id, user_id, signal_id, payload)
    values (${action.id}, ${userId}, ${signalId}, ${JSON.stringify(action)}::jsonb)
  `;
  return action;
}
