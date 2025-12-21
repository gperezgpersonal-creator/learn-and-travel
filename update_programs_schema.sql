-- Add missing columns to programs table
alter table public.programs 
add column if not exists image text,
add column if not exists itinerary jsonb default '[]'::jsonb,
add column if not exists flights jsonb default '[]'::jsonb,
add column if not exists inclusions text[] default '{}';

-- Ensure RLS allows update of these columns
-- (Existing policies cover "all" operations for staff, so no change needed there)
