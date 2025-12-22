
-- =============================================
-- Script: Create Coupons Table
-- Description: Creates a table for managing discount coupons.
-- Compatibility: Assumes 'programs.id' is TEXT. 
-- =============================================

-- 1. Create Table
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,                 -- The code user enters (e.g. 'SUMMER2026')
  description text,                          -- Internal description
  discount_type text check (discount_type in ('percentage', 'fixed')) not null,
  discount_value numeric not null,           -- 10.5 for $10.50 or 15 for 15%
  program_id text references public.programs(id) on delete cascade, -- Optional: Link to specific program
  expiration_date timestamp with time zone,  -- Optional: Expiry
  max_uses integer,                          -- Optional: Global limit
  used_count integer default 0,              -- Track usage
  active boolean default true,               -- Soft delete/disable
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.coupons enable row level security;

-- 3. Policies

-- Policy: Staff can do everything (CRUD)
drop policy if exists "Staff can manage coupons" on public.coupons;
create policy "Staff can manage coupons" on public.coupons
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );

-- Policy: Public can view active coupons
-- This is necessary for the frontend to validate a code before purchase.
-- We restrict visibility to only active, unexpired, and available coupons.
drop policy if exists "Public can view active coupons" on public.coupons;
create policy "Public can view active coupons" on public.coupons
  for select using (
    active = true 
    and (expiration_date is null or expiration_date > now())
    and (max_uses is null or used_count < max_uses)
  );

-- 4. Indexes
create index if not exists coupons_code_idx on public.coupons (code);
create index if not exists coupons_program_id_idx on public.coupons (program_id);

-- 5. Comments
comment on table public.coupons is 'Stores discount codes for programs.';
comment on column public.coupons.program_id is 'If NULL, coupon applies generally (logic handled in app). If set, applies only to that program.';
