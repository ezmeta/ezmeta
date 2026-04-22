-- EZ Meta Admin Suite Foundation

-- 1) Entitlement matrix (plan-feature governance)
create table if not exists public.plan_feature_entitlements (
  id uuid primary key default extensions.uuid_generate_v4(),
  plan_tier text not null check (plan_tier in ('free', 'basic', 'pro', 'agency')),
  feature_key text not null,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_tier, feature_key)
);

alter table public.plan_feature_entitlements enable row level security;

drop policy if exists "App can manage plan feature entitlements" on public.plan_feature_entitlements;
create policy "App can manage plan feature entitlements"
  on public.plan_feature_entitlements
  for all
  using (true)
  with check (true);

drop trigger if exists update_plan_feature_entitlements_updated_at on public.plan_feature_entitlements;
create trigger update_plan_feature_entitlements_updated_at
before update on public.plan_feature_entitlements
for each row execute function public.update_updated_at_column();

-- Seed defaults
insert into public.plan_feature_entitlements (plan_tier, feature_key, enabled)
values
  ('free', 'telegram_alerts', true),
  ('free', 'ai_copywriter', false),
  ('free', 'winning_ad_detector', false),
  ('free', 'creative_fatigue_alert', false),
  ('free', 'ai_smart_pilot', false),

  ('basic', 'telegram_alerts', true),
  ('basic', 'ai_copywriter', true),
  ('basic', 'winning_ad_detector', true),
  ('basic', 'creative_fatigue_alert', false),
  ('basic', 'ai_smart_pilot', false),

  ('pro', 'telegram_alerts', true),
  ('pro', 'ai_copywriter', true),
  ('pro', 'winning_ad_detector', true),
  ('pro', 'creative_fatigue_alert', true),
  ('pro', 'ai_smart_pilot', true),

  ('agency', 'telegram_alerts', true),
  ('agency', 'ai_copywriter', true),
  ('agency', 'winning_ad_detector', true),
  ('agency', 'creative_fatigue_alert', true),
  ('agency', 'ai_smart_pilot', true)
on conflict (plan_tier, feature_key) do nothing;

-- 2) Config audit log
create table if not exists public.config_audit_log (
  id uuid primary key default extensions.uuid_generate_v4(),
  admin_id text not null,
  action text not null,
  target_key text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

alter table public.config_audit_log enable row level security;

drop policy if exists "App can manage config audit log" on public.config_audit_log;
create policy "App can manage config audit log"
  on public.config_audit_log
  for all
  using (true)
  with check (true);

-- 3) Site settings history (versioning + rollback source)
create table if not exists public.site_settings_history (
  id uuid primary key default extensions.uuid_generate_v4(),
  snapshot jsonb not null,
  created_by text not null,
  created_at timestamptz not null default now()
);

alter table public.site_settings_history enable row level security;

drop policy if exists "App can manage site settings history" on public.site_settings_history;
create policy "App can manage site settings history"
  on public.site_settings_history
  for all
  using (true)
  with check (true);

-- 4) Pricing versioning table (effective_date support)
create table if not exists public.pricing_versions (
  id uuid primary key default extensions.uuid_generate_v4(),
  starter_price numeric(10,2) not null,
  pro_price numeric(10,2) not null,
  agency_price numeric(10,2) not null,
  effective_date timestamptz not null,
  notes text,
  created_by text not null,
  created_at timestamptz not null default now()
);

alter table public.pricing_versions enable row level security;

drop policy if exists "App can manage pricing versions" on public.pricing_versions;
create policy "App can manage pricing versions"
  on public.pricing_versions
  for all
  using (true)
  with check (true);

-- 5) Integration health center data source
create table if not exists public.integration_health (
  id uuid primary key default extensions.uuid_generate_v4(),
  provider text not null,
  status text not null check (status in ('green', 'red', 'amber')),
  reason_code text,
  latency_ms integer,
  last_sync_at timestamptz,
  webhook_status text,
  details jsonb default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (provider)
);

alter table public.integration_health enable row level security;

drop policy if exists "App can manage integration health" on public.integration_health;
create policy "App can manage integration health"
  on public.integration_health
  for all
  using (true)
  with check (true);

-- 6) AI usage events for granular cost tracking
create table if not exists public.ai_usage_events (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  feature_key text not null,
  model_name text not null,
  input_tokens integer default 0,
  output_tokens integer default 0,
  estimated_cost_usd numeric(12,6) default 0,
  created_at timestamptz not null default now()
);

alter table public.ai_usage_events enable row level security;

drop policy if exists "App can manage ai usage events" on public.ai_usage_events;
create policy "App can manage ai usage events"
  on public.ai_usage_events
  for all
  using (true)
  with check (true);

-- 7) System flags (global kill-switch etc.)
create table if not exists public.system_flags (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.system_flags enable row level security;

drop policy if exists "App can manage system flags" on public.system_flags;
create policy "App can manage system flags"
  on public.system_flags
  for all
  using (true)
  with check (true);

insert into public.system_flags (key, value)
values
  ('ai_kill_switch', '{"mode":"off"}'::jsonb)
on conflict (key) do nothing;

-- 8) User governance extension fields
alter table public.profiles
  add column if not exists manual_plan_override text,
  add column if not exists bonus_ad_account_limit integer not null default 0;

-- 9) Feedback workflow fields
alter table public.user_feedback
  add column if not exists status text not null default 'new',
  add column if not exists internal_notes text,
  add column if not exists resolved_at timestamptz;

alter table public.user_feedback
  drop constraint if exists user_feedback_status_check;

alter table public.user_feedback
  add constraint user_feedback_status_check check (status in ('new', 'resolved'));

