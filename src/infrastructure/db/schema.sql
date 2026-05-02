create table if not exists users (
  id text primary key,
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text
);

create table if not exists accounts (
  id text primary key,
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
  id text primary key,
  "sessionToken" text not null unique,
  "userId" text not null references users(id) on delete cascade,
  expires timestamptz not null
);

create table if not exists verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamptz not null,
  primary key(identifier, token)
);

create table if not exists briefops_radars (
  id text primary key,
  user_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists briefops_sources (
  id text primary key,
  user_id text not null,
  radar_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists briefops_signals (
  id text primary key,
  user_id text not null,
  radar_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists briefops_actions (
  id text primary key,
  user_id text not null,
  signal_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
