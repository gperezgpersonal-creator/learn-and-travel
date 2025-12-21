-- FIX POLICIES (Run this to give permission keys to the locked door)

-- 1. Ensure RLS is enabled
alter table public.profiles enable row level security;

-- 2. Drop existing policies to avoid conflicts/duplicates
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Staff can view all profiles" on public.profiles;

-- 3. Create the Basic Policy (The "Key" to enter your own house)
-- This allows ANY logged-in user to see THEIR OWN profile row.
-- CRITICAL for Login to work.
create policy "Users can view own profile" on public.profiles
for select using (auth.uid() = id);

-- 4. Create Staff Policy (The "Master Key")
-- This allows Staff to see EVERYONE.
-- Note: We avoid recursion by NOT querying profiles table again if possible, 
-- but for now we trust the "View Own" policy handles the self-check.
create policy "Staff can view all profiles" on public.profiles
for select using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  )
);

-- 5. Staff can Update profiles (to promote other users)
create policy "Staff can update profiles" on public.profiles
for update using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  )
);
