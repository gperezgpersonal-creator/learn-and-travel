-- 1. Ensure Columns Exist
ALTER TABLE public.programs
ADD COLUMN IF NOT EXISTS plans_json JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access (Essential for website)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.programs;
CREATE POLICY "Enable read access for all users" ON public.programs
FOR SELECT USING (true);

-- 4. Policy: Staff Full Access (Essential for Pricing Manager)
-- Allows authenticated users (like you when logged in) to Insert/Update/Delete
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.programs;
CREATE POLICY "Enable full access for authenticated users" ON public.programs
FOR ALL USING (auth.role() = 'authenticated');

-- 5. Policy: Service Role Bypass (Just in case)
-- (Usually automatic, but good to be sure no restrictive policies block it)

-- 6. Verify by listing columns
SELECT column_name FROM information_schema.columns WHERE table_name = 'programs';
