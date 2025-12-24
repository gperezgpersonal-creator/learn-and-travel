-- 011_fix_schema_all.sql
-- Consolidated Fix for Student Onboarding & Profiles
-- Run this in Supabase SQL Editor to ensure all schema updates are applied.

-- A. COLUMNS
-- 1. Address
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. Educational ID (Matricula)
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS educational_id TEXT;

-- B. VIEWS
-- Update student_balances view to include new columns
DROP VIEW IF EXISTS public.student_balances;

CREATE OR REPLACE VIEW public.student_balances AS
SELECT 
    s.id AS student_id,
    s.human_id,
    s.first_name,
    s.last_name,
    s.email,
    s.phone,
    s.educational_id, -- Ensure this is included
    s.created_at,
    s.medical_profile,
    s.logistics_profile,
    s.address,        -- Ensure this is included
    COALESCE(SUM(CASE WHEN fl.type = 'charge' THEN fl.amount ELSE 0 END), 0) AS total_charges,
    COALESCE(SUM(CASE WHEN fl.type = 'payment' THEN fl.amount ELSE 0 END), 0) AS total_payments,
    (COALESCE(SUM(CASE WHEN fl.type = 'charge' THEN fl.amount ELSE 0 END), 0) - 
     COALESCE(SUM(CASE WHEN fl.type = 'payment' THEN fl.amount ELSE 0 END), 0)) AS balance
FROM public.students s
LEFT JOIN public.finance_ledger fl ON s.id = fl.student_id
GROUP BY s.id;


-- C. SECURE RPCs for Magic Link (Bypassing RLS)

-- 1. Helper: Validate Token
CREATE OR REPLACE FUNCTION public.get_student_id_from_token(p_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_student_id UUID;
BEGIN
    SELECT student_id INTO v_student_id
    FROM public.magic_links
    WHERE token = p_token
    AND expires_at > NOW();
    RETURN v_student_id;
END;
$$;

-- 2. Update Student Data
CREATE OR REPLACE FUNCTION public.update_student_via_token(
    p_token TEXT,
    p_section TEXT,
    p_data JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_student_id UUID;
BEGIN
    -- Validate
    v_student_id := public.get_student_id_from_token(p_token);
    IF v_student_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired token';
    END IF;

    -- Update
    IF p_section = 'basic' THEN
        UPDATE public.students
        SET 
            first_name = COALESCE(p_data->>'first_name', first_name),
            last_name = COALESCE(p_data->>'last_name', last_name),
            educational_id = COALESCE(p_data->>'educational_id', educational_id),
            phone = COALESCE(p_data->>'phone', phone),
            address = COALESCE(p_data->>'address', address)
        WHERE id = v_student_id;
        
        -- Merge birth_date into logistics
        IF p_data ? 'birth_date' THEN
             UPDATE public.students
             SET logistics_profile = COALESCE(logistics_profile, '{}'::jsonb) || jsonb_build_object('birth_date', p_data->>'birth_date')
             WHERE id = v_student_id;
        END IF;

    ELSIF p_section = 'medical' THEN
        UPDATE public.students
        SET medical_profile = p_data
        WHERE id = v_student_id;
        
    ELSIF p_section = 'logistics' THEN
        UPDATE public.students
        SET logistics_profile = p_data
        WHERE id = v_student_id;
    END IF;
END;
$$;

-- 3. Register Document Upload
CREATE OR REPLACE FUNCTION public.register_document_via_token(
    p_token TEXT,
    p_document_type TEXT,
    p_file_path TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_student_id UUID;
    v_result JSONB;
BEGIN
    -- Validate
    v_student_id := public.get_student_id_from_token(p_token);
    IF v_student_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired token';
    END IF;

    -- Insert
    INSERT INTO public.student_documents (
        student_id,
        document_type,
        file_path,
        document_number,
        expiration_date,
        status,
        metadata
    )
    VALUES (
        v_student_id,
        p_document_type,
        p_file_path,
        p_metadata->>'document_number',
        (p_metadata->>'expiration_date')::DATE,
        'pending',
        p_metadata
    )
    RETURNING to_jsonb(public.student_documents.*) INTO v_result;

    RETURN v_result;
END;
$$;

-- D. STORAGE POLICIES
-- Ensure 'student-secure-docs' bucket exists (idempotent insert)
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-secure-docs', 'student-secure-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Public Upload Policy
DROP POLICY IF EXISTS "Public can upload secure docs" ON storage.objects;
CREATE POLICY "Public can upload secure docs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK ( bucket_id = 'student-secure-docs' );

-- E. PERMISSIONS
GRANT EXECUTE ON FUNCTION public.get_student_id_from_token TO public;
GRANT EXECUTE ON FUNCTION public.update_student_via_token TO public;
GRANT EXECUTE ON FUNCTION public.register_document_via_token TO public;
