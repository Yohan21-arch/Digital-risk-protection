-- SentinalBrand Phase 3.75: initial backend schema
-- Purpose: persist controlled brand references, monitored candidates, and deterministic scan history.
-- Suspicious identities remain controlled prototype data; this schema does not imply live platform monitoring.

create extension if not exists pgcrypto;

create type public.candidate_platform as enum (
  'X',
  'Instagram',
  'Facebook',
  'Telegram',
  'Google Play',
  'App Store',
  'Web Domain'
);

create type public.risk_category as enum (
  'Trusted',
  'Low',
  'Medium',
  'High',
  'Critical'
);

create type public.registry_match_status as enum (
  'MATCHED',
  'MISMATCH',
  'UNKNOWN'
);

create type public.visual_analysis_status as enum (
  'available',
  'unavailable'
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null unique,
  sector text not null,
  description text not null default '',
  is_builtin boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brand_domains (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  domain text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (brand_id, domain)
);

create table public.brand_publishers (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  publisher_name text not null,
  created_at timestamptz not null default now(),
  unique (brand_id, publisher_name)
);

create table public.brand_packages (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  package_identifier text not null,
  store public.candidate_platform check (store is null or store in ('Google Play', 'App Store')),
  created_at timestamptz not null default now(),
  unique (brand_id, package_identifier)
);

create table public.brand_social_handles (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  platform public.candidate_platform not null check (platform in ('X', 'Instagram', 'Facebook', 'Telegram')),
  handle text not null,
  created_at timestamptz not null default now(),
  unique (brand_id, platform, handle)
);

create table public.brand_visual_references (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  label text not null default 'Demo Official Reference',
  image_path text,
  primary_color text,
  secondary_color text,
  dhash text,
  symbol_description text,
  shape text,
  source text not null default 'prototype',
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidates (
  id text primary key,
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  handle_or_package text not null,
  platform public.candidate_platform not null,
  publisher text,
  official_entity text,
  summary text not null default '',
  audience text,
  detected_at timestamptz,
  is_known_official boolean not null default false,
  is_builtin boolean not null default true,
  source_label text not null default 'Controlled Prototype Candidate',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_visuals (
  id uuid primary key default gen_random_uuid(),
  candidate_id text not null references public.candidates(id) on delete cascade,
  image_path text,
  label text not null default 'Demo Candidate Visual',
  source text not null default 'prototype',
  primary_color text,
  secondary_color text,
  dhash text,
  symbol_description text,
  shape text,
  created_at timestamptz not null default now(),
  unique (candidate_id)
);

create table public.scan_runs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  engine_version text not null default 'sentinalbrand-deterministic-v1',
  candidate_count integer not null default 0 check (candidate_count >= 0),
  source text not null default 'web-prototype',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table public.scan_results (
  id uuid primary key default gen_random_uuid(),
  scan_run_id uuid not null references public.scan_runs(id) on delete cascade,
  candidate_id text not null references public.candidates(id) on delete cascade,
  risk_score integer not null check (risk_score between 0 and 100),
  risk_category public.risk_category not null,
  name_similarity numeric(5,2) check (name_similarity is null or name_similarity between 0 and 100),
  handle_similarity numeric(5,2) check (handle_similarity is null or handle_similarity between 0 and 100),
  description_similarity numeric(5,2) check (description_similarity is null or description_similarity between 0 and 100),
  visual_similarity numeric(5,2) check (visual_similarity is null or visual_similarity between 0 and 100),
  visual_status public.visual_analysis_status not null default 'unavailable',
  publisher_match public.registry_match_status,
  package_match public.registry_match_status,
  official_asset_match boolean not null default false,
  explanation jsonb not null default '[]'::jsonb,
  analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (scan_run_id, candidate_id)
);

create index brands_sector_idx on public.brands(sector);
create index brand_domains_brand_idx on public.brand_domains(brand_id);
create index brand_publishers_brand_idx on public.brand_publishers(brand_id);
create index brand_packages_brand_idx on public.brand_packages(brand_id);
create index brand_social_handles_brand_idx on public.brand_social_handles(brand_id);
create index candidates_brand_idx on public.candidates(brand_id);
create index candidates_platform_idx on public.candidates(platform);
create index candidates_brand_platform_idx on public.candidates(brand_id, platform);
create index candidates_official_idx on public.candidates(is_known_official);
create index scan_runs_brand_started_idx on public.scan_runs(brand_id, started_at desc);
create index scan_results_run_idx on public.scan_results(scan_run_id);
create index scan_results_risk_idx on public.scan_results(risk_category, risk_score desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger brands_set_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

create trigger brand_visual_references_set_updated_at
before update on public.brand_visual_references
for each row execute function public.set_updated_at();

create trigger candidates_set_updated_at
before update on public.candidates
for each row execute function public.set_updated_at();

-- Enable RLS on every application table. The anon client receives SELECT-only access to
-- controlled reference/candidate data. No anon INSERT/UPDATE/DELETE policies are created.
alter table public.brands enable row level security;
alter table public.brand_domains enable row level security;
alter table public.brand_publishers enable row level security;
alter table public.brand_packages enable row level security;
alter table public.brand_social_handles enable row level security;
alter table public.brand_visual_references enable row level security;
alter table public.candidates enable row level security;
alter table public.candidate_visuals enable row level security;
alter table public.scan_runs enable row level security;
alter table public.scan_results enable row level security;

create policy "public read active brands"
on public.brands for select
to anon, authenticated
using (is_active = true);

create policy "public read brand domains"
on public.brand_domains for select
to anon, authenticated
using (exists (select 1 from public.brands b where b.id = brand_id and b.is_active = true));

create policy "public read brand publishers"
on public.brand_publishers for select
to anon, authenticated
using (exists (select 1 from public.brands b where b.id = brand_id and b.is_active = true));

create policy "public read brand packages"
on public.brand_packages for select
to anon, authenticated
using (exists (select 1 from public.brands b where b.id = brand_id and b.is_active = true));

create policy "public read brand social handles"
on public.brand_social_handles for select
to anon, authenticated
using (exists (select 1 from public.brands b where b.id = brand_id and b.is_active = true));

create policy "public read brand visual references"
on public.brand_visual_references for select
to anon, authenticated
using (exists (select 1 from public.brands b where b.id = brand_id and b.is_active = true));

create policy "public read controlled candidates"
on public.candidates for select
to anon, authenticated
using (exists (select 1 from public.brands b where b.id = brand_id and b.is_active = true));

create policy "public read candidate visuals"
on public.candidate_visuals for select
to anon, authenticated
using (
  exists (
    select 1
    from public.candidates c
    join public.brands b on b.id = c.brand_id
    where c.id = candidate_id and b.is_active = true
  )
);

-- Scan history is intentionally NOT public. It has RLS enabled with no anon/authenticated
-- policies until ownership/authentication is introduced. Trusted backend code may use the
-- service role to persist scans later.

comment on table public.brands is 'Controlled SentinalBrand prototype brand registry.';
comment on table public.candidates is 'Controlled prototype monitoring identities; rows do not represent claims about live malicious accounts.';
comment on table public.scan_results is 'Deterministic SentinalBrand analysis output separated from observed candidate data.';
