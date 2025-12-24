CREATE OR REPLACE FUNCTION public.validate_magic_link(token_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    link_record RECORD;
BEGIN
    SELECT * INTO link_record FROM public.magic_links WHERE token = token_input;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Token not found');
    END IF;

    IF link_record.expires_at < NOW() THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Token expired');
    END IF;

    -- Return student info (valid)
    RETURN jsonb_build_object(
        'valid', true, 
        'student_id', link_record.student_id
    );
END;
$$;
