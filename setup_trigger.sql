-- Robust Trigger Setup
-- Run this in Supabase SQL Editor to ensure profiles are created for ALL new users.

-- 1. Drop existing objects to start fresh
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Create the function with robust error handling and search_path
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    -- Handle missing metadata gracefully
    coalesce(new.raw_user_meta_data->>'full_name', ''), 
    -- Default to 'user' if no role specified
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public; -- Ensure public schema is used

-- 3. Re-create the trigger for ANY insert on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Retroactive Fix: Create profiles for any existing users that don't have one
insert into public.profiles (id, email, full_name, role)
select id, email, '', 'user'
from auth.users
where id not in (select id from public.profiles);
