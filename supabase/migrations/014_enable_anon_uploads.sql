-- Enable public/anon uploads to student-secure-docs bucket
-- This is required for the Magic Link onboarding flow where users are 'anon'

BEGIN;

-- 1. Ensure the bucket exists (idempotent)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-secure-docs', 'student-secure-docs', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Policy for INSERT (Upload) for 'anon' role (public)
-- We check bucket_id to restrict this to only our specific bucket
DROP POLICY IF EXISTS "Allow anon uploads to student-secure-docs" ON storage.objects;

CREATE POLICY "Allow anon uploads to student-secure-docs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'student-secure-docs');

-- 3. (Optional) Allow Select? 
-- Generally we don't need anon SELECT if we only show "Uploaded on date". 
-- If we wanted to let them preview, we'd need another policy or use signed URLs. 
-- For now, focused on fixing the UPLOAD error.

COMMIT;
