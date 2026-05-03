import { sql } from "./sql";
import type {
  GeneratedAction,
  Radar,
  RadarRun,
  RadarRunStatus,
  Signal,
  SignalStatus,
  Source,
  SourceStatus
} from "@shared/models/domain";
import { createSeedRadar, createSeedSignals, createSeedSources, demoUserId } from "./seed-data";

type UserData = {
  radar: Radar;
  sources: Source[];
  signals: Signal[];
  actions: GeneratedAction[];
  runs: RadarRun[];
};

const memoryStore = new Map<string, UserData>();

function hasPostgres() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

function canUseMemoryStore() {
  return process.env.BRIEFOPS_ENABLE_DEMO_MODE === "true";
}

function now() {
  return new Date().toISOString();
}

function seedMemoryUser(userId: string) {
  if (!canUseMemoryStore()) {
    throw new Error("BriefOps storage is not configured. Set POSTGRES_URL or enable BRIEFOPS_ENABLE_DEMO_MODE=true.");
  }

  const existing = memoryStore.get(userId);
  if (existing) return existing;

  const radar = createSeedRadar(userId);
  const sources = createSeedSources(userId, radar.id);
  const signals = createSeedSignals(userId, radar.id, sources);
  const data = { radar, sources, signals, actions: [], runs: [] };
  memoryStore.set(userId, data);
  return data;
}

async function ensureSchema() {
  if (!hasPostgres()) return;

  await sql`
    create table if not exists briefops_allowed_emails (
      email text primary key,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_beta_radars (
      id text primary key,
      user_id text not null,
      name text not null,
      profile text not null,
      goal text not null,
      level text not null,
      interests jsonb not null default '[]'::jsonb,
      avoid_topics jsonb not null default '[]'::jsonb,
      output_types jsonb not null default '[]'::jsonb,
      onboarding_completed boolean not null default false,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_beta_sources (
      id text primary key,
      user_id text not null,
      radar_id text not null references briefops_beta_radars(id) on delete cascade,
      name text not null,
      url text not null,
      type text not null,
      suggested_frequency text not null,
      trust_score integer not null,
      last_checked_at timestamptz,
      last_error text,
      status text not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_beta_raw_items (
      id text primary key,
      user_id text not null,
      radar_id text not null,
      source_id text not null,
      title text not null,
      url text not null,
      author text,
      published_at timestamptz not null,
      excerpt text not null,
      tags jsonb not null default '[]'::jsonb,
      source_type text not null,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_beta_signals (
      id text primary key,
      user_id text not null,
      radar_id text not null references briefops_beta_radars(id) on delete cascade,
      source_id text not null,
      title text not null,
      source_name text not null,
      source_url text not null,
      published_at timestamptz not null,
      type text not null,
      status text not null,
      summary text not null,
      why_it_matters text not null,
      recommended_action text not null,
      score_explanation text not null,
      relevance integer not null,
      novelty integer not null,
      impact integer not null,
      actionability integer not null,
      urgency integer not null,
      confidence integer not null,
      signal_score integer not null,
      citations jsonb not null default '[]'::jsonb,
      tags jsonb not null default '[]'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_beta_actions (
      id text primary key,
      user_id text not null,
      signal_id text not null,
      kind text not null,
      title text not null,
      body text not null,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists briefops_beta_radar_runs (
      id text primary key,
      user_id text not null,
      radar_id text not null references briefops_beta_radars(id) on delete cascade,
      status text not null,
      started_at timestamptz not null default now(),
      finished_at timestamptz,
      sources_checked integer not null default 0,
      raw_items_found integer not null default 0,
      signals_created integer not null default 0,
      error text
    )
  `;
}

function radarFromRow(row: {
  id: string;
  user_id: string;
  name: string;
  profile: Radar["profile"];
  goal: Radar["goal"];
  level: Radar["level"];
  interests: string[];
  avoid_topics: string[];
  output_types: Radar["outputTypes"];
  onboarding_completed: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}): Radar {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    profile: row.profile,
    goal: row.goal,
    level: row.level,
    interests: row.interests,
    avoidTopics: row.avoid_topics,
    outputTypes: row.output_types,
    onboardingCompleted: row.onboarding_completed,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

function sourceFromRow(row: {
  id: string;
  user_id: string;
  radar_id: string;
  name: string;
  url: string;
  type: Source["type"];
  suggested_frequency: string;
  trust_score: number;
  last_checked_at: Date | string | null;
  last_error: string | null;
  status: SourceStatus;
}): Source {
  return {
    id: row.id,
    userId: row.user_id,
    radarId: row.radar_id,
    name: row.name,
    url: row.url,
    type: row.type,
    suggestedFrequency: row.suggested_frequency,
    trustScore: row.trust_score,
    lastCheckedAt: row.last_checked_at ? new Date(row.last_checked_at).toISOString() : null,
    lastError: row.last_error,
    status: row.status
  };
}

function signalFromRow(row: {
  id: string;
  user_id: string;
  radar_id: string;
  source_id: string;
  title: string;
  source_name: string;
  source_url: string;
  published_at: Date | string;
  type: Signal["type"];
  status: SignalStatus;
  summary: string;
  why_it_matters: string;
  recommended_action: string;
  score_explanation: string;
  relevance: number;
  novelty: number;
  impact: number;
  actionability: number;
  urgency: number;
  confidence: number;
  signal_score: number;
  citations: Signal["citations"];
  tags: string[];
}): Signal {
  return {
    id: row.id,
    userId: row.user_id,
    radarId: row.radar_id,
    sourceId: row.source_id,
    title: row.title,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    publishedAt: new Date(row.published_at).toISOString(),
    type: row.type,
    status: row.status,
    summary: row.summary,
    whyItMatters: row.why_it_matters,
    recommendedAction: row.recommended_action,
    scoreExplanation: row.score_explanation,
    scores: {
      relevance: row.relevance,
      novelty: row.novelty,
      impact: row.impact,
      actionability: row.actionability,
      urgency: row.urgency,
      confidence: row.confidence
    },
    signalScore: row.signal_score,
    citations: row.citations,
    tags: row.tags
  };
}

async function insertRadar(radar: Radar) {
  await sql`
    insert into briefops_beta_radars (
      id, user_id, name, profile, goal, level, interests, avoid_topics, output_types,
      onboarding_completed, created_at, updated_at
    )
    values (
      ${radar.id}, ${radar.userId}, ${radar.name}, ${radar.profile}, ${radar.goal}, ${radar.level},
      ${JSON.stringify(radar.interests)}::jsonb, ${JSON.stringify(radar.avoidTopics)}::jsonb,
      ${JSON.stringify(radar.outputTypes)}::jsonb, ${radar.onboardingCompleted},
      ${radar.createdAt}, ${radar.updatedAt}
    )
  `;
}

async function insertSource(source: Source) {
  await sql`
    insert into briefops_beta_sources (
      id, user_id, radar_id, name, url, type, suggested_frequency, trust_score,
      last_checked_at, last_error, status
    )
    values (
      ${source.id}, ${source.userId}, ${source.radarId}, ${source.name}, ${source.url},
      ${source.type}, ${source.suggestedFrequency}, ${source.trustScore},
      ${source.lastCheckedAt}, ${source.lastError}, ${source.status}
    )
  `;
}

async function insertSignal(signal: Signal) {
  await sql`
    insert into briefops_beta_signals (
      id, user_id, radar_id, source_id, title, source_name, source_url, published_at, type, status,
      summary, why_it_matters, recommended_action, score_explanation, relevance, novelty, impact,
      actionability, urgency, confidence, signal_score, citations, tags
    )
    values (
      ${signal.id}, ${signal.userId}, ${signal.radarId}, ${signal.sourceId}, ${signal.title},
      ${signal.sourceName}, ${signal.sourceUrl}, ${signal.publishedAt}, ${signal.type}, ${signal.status},
      ${signal.summary}, ${signal.whyItMatters}, ${signal.recommendedAction}, ${signal.scoreExplanation},
      ${signal.scores.relevance}, ${signal.scores.novelty}, ${signal.scores.impact},
      ${signal.scores.actionability}, ${signal.scores.urgency}, ${signal.scores.confidence},
      ${signal.signalScore}, ${JSON.stringify(signal.citations)}::jsonb, ${JSON.stringify(signal.tags)}::jsonb
    )
    on conflict (id) do nothing
  `;
}

async function seedPostgresUser(userId: string) {
  await ensureSchema();

  const existing = await sql<{ id: string }>`
    select id from briefops_beta_radars where user_id = ${userId} limit 1
  `;

  if ((existing.rowCount ?? 0) > 0) return;

  const radar = createSeedRadar(userId);
  const sources = createSeedSources(userId, radar.id);
  const signals = createSeedSignals(userId, radar.id, sources);

  await insertRadar(radar);
  for (const source of sources) await insertSource(source);
  for (const signal of signals) await insertSignal(signal);
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
  const result = await sql<Parameters<typeof radarFromRow>[0]>`
    select * from briefops_beta_radars where user_id = ${userId} limit 1
  `;
  return radarFromRow(result.rows[0]);
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
    update briefops_beta_radars
    set name = ${payload.name},
      profile = ${payload.profile},
      goal = ${payload.goal},
      level = ${payload.level},
      interests = ${JSON.stringify(payload.interests)}::jsonb,
      avoid_topics = ${JSON.stringify(payload.avoidTopics)}::jsonb,
      output_types = ${JSON.stringify(payload.outputTypes)}::jsonb,
      onboarding_completed = ${payload.onboardingCompleted},
      updated_at = now()
    where user_id = ${userId} and id = ${nextRadar.id}
  `;
  return payload;
}

export async function getSources(userId = demoUserId): Promise<Source[]> {
  if (!hasPostgres()) return seedMemoryUser(userId).sources;

  await ensureUserSeed(userId);
  const result = await sql<Parameters<typeof sourceFromRow>[0]>`
    select * from briefops_beta_sources where user_id = ${userId} order by created_at desc, id
  `;
  return result.rows.map(sourceFromRow);
}

export async function createSource(userId: string, source: Source) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.sources = [{ ...source, userId }, ...data.sources];
    memoryStore.set(userId, data);
    return source;
  }

  await ensureSchema();
  await insertSource({ ...source, userId });
  return source;
}

export async function updateSourceStatus(userId: string, sourceId: string, status: SourceStatus) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.sources = data.sources.map((source) => (source.id === sourceId ? { ...source, status } : source));
    memoryStore.set(userId, data);
    return;
  }

  await sql`
    update briefops_beta_sources
    set status = ${status}, updated_at = now()
    where user_id = ${userId} and id = ${sourceId}
  `;
}

export async function updateSource(userId: string, source: Source) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.sources = data.sources.map((item) => (item.id === source.id ? { ...source, userId } : item));
    memoryStore.set(userId, data);
    return source;
  }

  await sql`
    update briefops_beta_sources
    set name = ${source.name},
      url = ${source.url},
      type = ${source.type},
      suggested_frequency = ${source.suggestedFrequency},
      trust_score = ${source.trustScore},
      last_error = ${source.lastError},
      status = ${source.status},
      updated_at = now()
    where user_id = ${userId} and id = ${source.id}
  `;
  return source;
}

export async function updateSourceCheckResult(
  userId: string,
  sourceId: string,
  result: { checkedAt: string; error: string | null }
) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.sources = data.sources.map((source) =>
      source.id === sourceId
        ? { ...source, lastCheckedAt: result.checkedAt, lastError: result.error }
        : source
    );
    memoryStore.set(userId, data);
    return;
  }

  await sql`
    update briefops_beta_sources
    set last_checked_at = ${result.checkedAt}, last_error = ${result.error}, updated_at = now()
    where user_id = ${userId} and id = ${sourceId}
  `;
}

export async function deleteSource(userId: string, sourceId: string) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.sources = data.sources.filter((source) => source.id !== sourceId);
    memoryStore.set(userId, data);
    return;
  }

  await sql`
    delete from briefops_beta_sources where user_id = ${userId} and id = ${sourceId}
  `;
}

export async function getSignals(userId = demoUserId): Promise<Signal[]> {
  if (!hasPostgres()) return seedMemoryUser(userId).signals;

  await ensureUserSeed(userId);
  const result = await sql<Parameters<typeof signalFromRow>[0]>`
    select * from briefops_beta_signals where user_id = ${userId}
    order by signal_score desc, published_at desc
  `;
  return result.rows.map(signalFromRow);
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

  await sql`
    update briefops_beta_signals
    set status = ${status}, updated_at = now()
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
  const signalExists = (await getSignals(userId)).some((signal) => signal.id === signalId);
  if (!signalExists) throw new Error("Cannot create an action for a signal that does not belong to this user.");

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
    insert into briefops_beta_actions (id, user_id, signal_id, kind, title, body, created_at)
    values (${action.id}, ${userId}, ${signalId}, ${kind}, ${title}, ${body}, ${action.createdAt})
  `;
  return action;
}

export async function getActions(userId = demoUserId): Promise<GeneratedAction[]> {
  if (!hasPostgres()) return seedMemoryUser(userId).actions;

  await ensureSchema();
  const result = await sql<{
    id: string;
    user_id: string;
    signal_id: string;
    kind: GeneratedAction["kind"];
    title: string;
    body: string;
    created_at: Date | string;
  }>`
    select * from briefops_beta_actions where user_id = ${userId} order by created_at desc
  `;
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    signalId: row.signal_id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    createdAt: new Date(row.created_at).toISOString()
  }));
}

export async function createRadarRun(userId: string, radarId: string, sourcesChecked: number) {
  const run: RadarRun = {
    id: `${radarId}-run-${Date.now()}`,
    userId,
    radarId,
    status: "queued",
    startedAt: now(),
    finishedAt: null,
    sourcesChecked,
    rawItemsFound: 0,
    signalsCreated: 0,
    error: null
  };

  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.runs = [run, ...data.runs];
    memoryStore.set(userId, data);
    return run;
  }

  await ensureSchema();
  await sql`
    insert into briefops_beta_radar_runs (
      id, user_id, radar_id, status, started_at, sources_checked, raw_items_found, signals_created, error
    )
    values (
      ${run.id}, ${userId}, ${radarId}, ${run.status}, ${run.startedAt}, ${sourcesChecked}, 0, 0, null
    )
  `;
  return run;
}

export async function markRadarRunRunning(userId: string, runId: string) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.runs = data.runs.map((run) => (run.id === runId ? { ...run, status: "running" } : run));
    memoryStore.set(userId, data);
    return;
  }

  await sql`
    update briefops_beta_radar_runs
    set status = 'running'
    where user_id = ${userId} and id = ${runId}
  `;
}

export async function completeRadarRun(
  userId: string,
  runId: string,
  status: Exclude<RadarRunStatus, "queued" | "running">,
  result: Pick<RadarRun, "rawItemsFound" | "signalsCreated" | "error">
) {
  if (!hasPostgres()) {
    const data = seedMemoryUser(userId);
    data.runs = data.runs.map((run) =>
      run.id === runId ? { ...run, ...result, status, finishedAt: now() } : run
    );
    memoryStore.set(userId, data);
    return;
  }

  await sql`
    update briefops_beta_radar_runs
    set status = ${status},
      finished_at = now(),
      raw_items_found = ${result.rawItemsFound},
      signals_created = ${result.signalsCreated},
      error = ${result.error}
    where user_id = ${userId} and id = ${runId}
  `;
}

export async function getRadarRuns(userId = demoUserId): Promise<RadarRun[]> {
  if (!hasPostgres()) return seedMemoryUser(userId).runs;

  await ensureSchema();
  const result = await sql<{
    id: string;
    user_id: string;
    radar_id: string;
    status: RadarRunStatus;
    started_at: Date | string;
    finished_at: Date | string | null;
    sources_checked: number;
    raw_items_found: number;
    signals_created: number;
    error: string | null;
  }>`
    select * from briefops_beta_radar_runs where user_id = ${userId} order by started_at desc
  `;
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    radarId: row.radar_id,
    status: row.status,
    startedAt: new Date(row.started_at).toISOString(),
    finishedAt: row.finished_at ? new Date(row.finished_at).toISOString() : null,
    sourcesChecked: row.sources_checked,
    rawItemsFound: row.raw_items_found,
    signalsCreated: row.signals_created,
    error: row.error
  }));
}
