-- 1. Insert your profile manually (since the trigger missed it)
-- Replace 'admin@learnandtravel.com' with the email you used to sign up
insert into public.profiles (id, email, role, full_name)
select id, email, 'staff', 'Admin User'
from auth.users
where email = 'TU_EMAIL_AQUI' -- <--- PON TU EMAIL AQUI
on conflict (id) do update
set role = 'staff';

-- 2. Verify the Trigger is actually active for future users
drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'user'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
