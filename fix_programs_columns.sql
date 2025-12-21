-- Fix missing timestamp columns in programs table
alter table public.programs 
add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null,
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
