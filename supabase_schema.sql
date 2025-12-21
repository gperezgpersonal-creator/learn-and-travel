-- 1. Profiles Table (For Staff Login and basic user identification)
-- This table extends the default auth.users table in Supabase
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('staff', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles
-- Public can view own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Staff can view all profiles
create policy "Staff can view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );

-- Function to handle new user creation automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'user'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Programs Table (For CMS - Price editing)
create table public.programs (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,         -- e.g., 'orlando-business-2026'
  internal_id text unique,           -- e.g., '84-ORL2026'
  title text not null,
  destination text not null,
  description text,
  price numeric not null default 0,
  currency text default 'USD',
  status text check (status in ('draft', 'published')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Programs RLS
alter table public.programs enable row level security;
-- Everyone can read published programs
create policy "Public can view published programs" on public.programs
  for select using (status = 'published' or auth.role() = 'service_role');
-- Staff can do everything
create policy "Staff can manage programs" on public.programs
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );


-- 3. Program Plans (Payment Plans linked to Programs)
create table public.program_plans (
  id uuid default gen_random_uuid() primary key,
  program_id uuid references public.programs(id) on delete cascade not null,
  name text not null,                -- e.g., 'Pago de Contado'
  price numeric not null,
  deadline date,                     -- Optional deadline
  status text check (status in ('active', 'hidden', 'sold_out')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.program_plans enable row level security;
-- Policies same as programs (Public read, Staff all)
create policy "Public can view active plans" on public.program_plans
  for select using (status = 'active');
create policy "Staff can manage plans" on public.program_plans
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );


-- 4. Quotes (For Quote Generator & History)
create table public.quotes (
  id uuid default gen_random_uuid() primary key,
  program_slug text not null,        -- Linked loosely to allow flexibility or FK if strict
  client_name text not null,
  version_name text not null,        -- User given name for the quote version
  city text,
  dates text,
  total_price numeric not null,
  price_dbl numeric,                 -- Standard Double Occupancy Price
  summary text,                      -- Text summary of inclusions
  data_json jsonb not null,          -- Full JSON dump of the quote state
  created_by uuid references auth.users(id), -- Staff who created it
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quotes enable row level security;
-- Staff only access
create policy "Staff can manage quotes" on public.quotes
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );


-- 5. Prospects (From Contact Forms)
-- Separated from Users/Students as requested
create table public.prospects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  interest text,                     -- 'Programas Educativos', etc.
  message text,
  status text check (status in ('new', 'contacted', 'converted', 'archived')) default 'new',
  source text default 'web_form',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text                         -- Internal staff notes
);

alter table public.prospects enable row level security;
-- Public (Anon) can Insert (submit form)
create policy "Public can create prospects" on public.prospects
  for insert with check (true);
-- Staff can viewing and updating
create policy "Staff can view and update prospects" on public.prospects
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );
create policy "Staff can update prospects" on public.prospects
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'staff'
    )
  );
