-- Migration: 016_update_student_email_rpc.sql
-- Updates the update_student_via_token function to allow updating the email address.

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
            email = COALESCE(p_data->>'email', email), -- Added email update
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

-- Ensure permissions are maintained
GRANT EXECUTE ON FUNCTION public.update_student_via_token(TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.update_student_via_token(TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_student_via_token(TEXT, TEXT, JSONB) TO service_role;
