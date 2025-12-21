-- EMERGENCY CONNECTIVITY FIX
-- 1. Temporarily DISABLE Row Level Security on profiles
alter table public.profiles disable row level security;

-- 2. Force-Insert the Staff User
insert into public.profiles (id, email, full_name, role)
select id, email, 'Guillermo', 'staff'
from auth.users
where email = 'guillermo@ariagui.com'
on conflict (id) do update
set role = 'staff';

-- 3. Verify it exists
select * from public.profiles where email = 'guillermo@ariagui.com';
