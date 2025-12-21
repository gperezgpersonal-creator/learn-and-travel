-- FIX INFINITE RECURSION IN RLS
-- The previous error was because the policy tried to read the table to check permissions,
-- which triggered the policy again -> Infinite Loop.

-- 1. Create a "Safe" function to check role (Bypasses RLS)
create or replace function public.is_staff()
returns boolean as $$
begin
  -- 'security definer' means this function runs with Superuser privileges,
  -- bypassing the RLS check to safely read the role.
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  );
end;
$$ language plpgsql security definer;

-- 2. Drop old recursive policies
drop policy if exists "Staff can view all profiles" on public.profiles;
drop policy if exists "Staff can update profiles" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;

-- 3. Re-create Clean Policies

-- A. Login Requirement: Everyone sees their own profile
create policy "Users can view own profile" on public.profiles
for select using (auth.uid() = id);

-- B. Staff Power: Staff sees everything (using the safe function)
create policy "Staff can view all profiles" on public.profiles
for select using (public.is_staff());

-- C. Staff Edit: Staff can edit everything
create policy "Staff can update profiles" on public.profiles
for update using (public.is_staff());
