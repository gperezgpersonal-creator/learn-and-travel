-- ==========================================
-- REPAIR SCRIPT: Fix all schema issues at once
-- ==========================================

-- 1. Programs Table Fixes
create table if not exists public.programs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null, 
  destination text not null,
  price numeric not null default 0,
  currency text default 'USD',
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist (Idempotent)
alter table public.programs 
add column if not exists internal_id text unique,
add column if not exists image text,
add column if not exists itinerary jsonb default '[]'::jsonb,
add column if not exists flights jsonb default '[]'::jsonb,
add column if not exists inclusions text[] default '{}',
add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null,
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- 2. Program Plans Table (Create if missing)
create table if not exists public.program_plans (
  id uuid default gen_random_uuid() primary key,
  program_id uuid references public.programs(id) on delete cascade not null,
  name text not null,
  price numeric not null,
  deadline date,
  status text check (status in ('active', 'hidden', 'sold_out')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS on program_plans
alter table public.program_plans enable row level security;

-- 4. RLS Policies for program_plans (Drop first to avoid conflicts)
drop policy if exists "Public can view active plans" on public.program_plans;
drop policy if exists "Staff can manage plans" on public.program_plans;

create policy "Public can view active plans" on public.program_plans
  for select using (status = 'active');

create policy "Staff can manage plans" on public.program_plans
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );

-- 5. Force Schema Cache Reload
NOTIFY pgrst, 'reload config';
