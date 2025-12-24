-- Secure RPCs for Magic Link Onboarding

-- 1. Function to update student data securely via token
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
    -- Validate Token
    SELECT student_id INTO v_student_id
    FROM public.magic_links
    WHERE token = p_token
    AND expires_at > NOW();

    IF v_student_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired token';
    END IF;

    -- Update based on section
    IF p_section = 'basic' THEN
        UPDATE public.students
        SET 
            first_name = COALESCE(p_data->>'first_name', first_name),
            last_name = COALESCE(p_data->>'last_name', last_name),
            educational_id = COALESCE(p_data->>'educational_id', educational_id),
            phone = COALESCE(p_data->>'phone', phone),
            address = COALESCE(p_data->>'address', address)
        WHERE id = v_student_id;
        
        -- Handle birth_date if present (merge into logistics)
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

-- 2. Function to register document upload securely via token
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
    v_doc_id UUID;
    v_result JSONB;
BEGIN
    -- Validate Token
    SELECT student_id INTO v_student_id
    FROM public.magic_links
    WHERE token = p_token
    AND expires_at > NOW();

    IF v_student_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired token';
    END IF;

    -- Insert Document
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

-- 3. Open Storage Bucket for Public Insert (Upload)
-- This allows the client to upload the file to `student-secure-docs`.
-- Security is maintained because `student_documents` table linkage requires the token via RPC.
DROP POLICY IF EXISTS "Public can upload secure docs" ON storage.objects;
CREATE POLICY "Public can upload secure docs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK ( bucket_id = 'student-secure-docs' );

-- Ensure public execution
GRANT EXECUTE ON FUNCTION public.update_student_via_token TO public;
GRANT EXECUTE ON FUNCTION public.register_document_via_token TO public;
