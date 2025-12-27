-- Migration: 013_enhance_validate_magic_link.sql
-- Updates the validate_magic_link function to return basic student info
-- This allows the Onboarding Wizard to load data without needing RLS policies on the 'students' table for anon.

DROP FUNCTION IF EXISTS public.validate_magic_link(text);

CREATE OR REPLACE FUNCTION public.validate_magic_link(token_input text)
RETURNS TABLE (
    valid boolean,
    student_id uuid,
    first_name text,
    last_name text,
    email text,
    phone text,
    educational_id text,
    address text,
    medical_profile jsonb,
    logistics_profile jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as owner (postgres) to bypass RLS
AS $$
DECLARE
    v_student_id uuid;
    v_expires_at timestamptz;
BEGIN
    -- 1. Find the token
    SELECT 
        ml.student_id, 
        ml.expires_at 
    INTO 
        v_student_id, 
        v_expires_at
    FROM magic_links ml
    WHERE ml.token = token_input;

    -- 2. Validate
    IF v_student_id IS NULL THEN
        RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::jsonb, NULL::jsonb;
        RETURN;
    END IF;

    IF v_expires_at < NOW() THEN
        RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::jsonb, NULL::jsonb;
        RETURN;
    END IF;

    -- 3. Return Data
    RETURN QUERY 
    SELECT 
        true,
        s.id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone,
        s.educational_id,
        s.address,
        s.medical_profile,
        s.logistics_profile
    FROM students s
    WHERE s.id = v_student_id;
END;
$$;
