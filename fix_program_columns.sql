-- Add missing columns to programs table to support Pricing Manager
ALTER TABLE public.programs
ADD COLUMN IF NOT EXISTS plans_json JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'programs';
