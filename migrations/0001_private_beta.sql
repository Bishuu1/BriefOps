create extension if not exists pgcrypto;

create table if not exists users (
  id text primary key default gen_random_uuid()::text,
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text
);

create table if not exists accounts (
  id text primary key default gen_random_uuid()::text,
  "userId" text not null references users(id) on delete cascade,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique(provider, "providerAccountId")
);

create table if not exists sessions (
  id text primary key default gen_random_uuid()::text,
  "sessionToken" text not null unique,
  "userId" text not null references users(id) on delete cascade,
  expires timestamptz not null
);

create table if not exists verification_token (
  identifier text not null,
  token text not null,
  expires timestamptz not null,
  primary key(identifier, token)
);

create table if not exists briefops_allowed_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

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
);

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
);

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
);

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
);

create table if not exists briefops_beta_actions (
  id text primary key,
  user_id text not null,
  signal_id text not null,
  kind text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

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
);

create index if not exists briefops_beta_radars_user_id_idx on briefops_beta_radars(user_id);
create index if not exists briefops_beta_sources_user_id_idx on briefops_beta_sources(user_id);
create index if not exists briefops_beta_signals_user_id_idx on briefops_beta_signals(user_id);
create index if not exists briefops_beta_actions_user_id_idx on briefops_beta_actions(user_id);
create index if not exists briefops_beta_runs_user_id_idx on briefops_beta_radar_runs(user_id);
