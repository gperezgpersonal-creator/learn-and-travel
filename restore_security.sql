-- SECURITY RESTORATION
-- Re-enable Row Level Security on profiles
alter table public.profiles enable row level security;

-- Verify policies are active
select * from pg_policies where tablename = 'profiles';
