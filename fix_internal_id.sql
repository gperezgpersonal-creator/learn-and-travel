-- Add internal_id column if it is missing
alter table public.programs 
add column if not exists internal_id text unique;

-- Force schema cache reload (Supabase sometimes caches schema aggressively)
NOTIFY pgrst, 'reload config';
