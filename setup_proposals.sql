-- Create Proposals Table if not exists
create table if not exists public.proposals (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    client_name text not null,
    status text check (status in ('Draft', 'Sent', 'Approved', 'Changes Requested')) default 'Draft',
    latest_version_number int default 0,
    is_hidden boolean default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add new columns safely (idempotent migration)
do $$ 
begin
    alter table public.proposals add column if not exists approver_name text;
    alter table public.proposals add column if not exists approver_email text;
    alter table public.proposals add column if not exists approved_at timestamp with time zone;
    alter table public.proposals add column if not exists terms_accepted boolean default false;
exception
    when others then null;
end $$;

-- Enable RLS on Proposals
alter table public.proposals enable row level security;

-- Policies for Proposals
-- Staff can manage everything
drop policy if exists "Staff can manage proposals" on public.proposals;
create policy "Staff can manage proposals" on public.proposals
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'staff'
        )
    );

-- Public can view non-hidden proposals
drop policy if exists "Public can view non-hidden proposals" on public.proposals;
create policy "Public can view non-hidden proposals" on public.proposals
    for select using (true);
 


-- Create Proposal Versions Table
create table if not exists public.proposal_versions (
    id uuid default gen_random_uuid() primary key,
    proposal_id uuid references public.proposals(id) on delete cascade not null,
    version_number int not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    content jsonb not null default '{}'::jsonb,
    is_published boolean default false
);

-- Enable RLS on Versions
alter table public.proposal_versions enable row level security;

-- Policies for Versions
-- Staff can manage
drop policy if exists "Staff can manage proposal versions" on public.proposal_versions;
create policy "Staff can manage proposal versions" on public.proposal_versions
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'staff'
        )
    );

-- Public access: Only published versions
drop policy if exists "Public can view published versions" on public.proposal_versions;
create policy "Public can view published versions" on public.proposal_versions
    for select using (is_published = true);
