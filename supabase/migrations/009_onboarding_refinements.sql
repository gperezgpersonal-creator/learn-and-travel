-- 009_onboarding_refinements.sql

-- Add address column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS address TEXT;

-- (Optional) If we wanted to structure emergency contact explicitly in columns we could, 
-- but plan is to put it in medical_profile JSONB, which already exists.
-- Same for document metadata which goes into student_documents table which already has columns.
