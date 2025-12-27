-- Function to update document metadata via token
-- Allows editing document details even after upload

CREATE OR REPLACE FUNCTION public.update_document_metadata_via_token(
  p_token TEXT,
  p_document_type TEXT,
  p_metadata JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id UUID;
  v_link_valid BOOLEAN;
  v_doc_record RECORD;
BEGIN
  -- 1. Validate Token
  SELECT student_id INTO v_student_id
  FROM public.magic_links
  WHERE token = p_token
    AND expires_at > NOW();

  IF v_student_id IS NULL THEN
     RAISE EXCEPTION 'Invalid or expired token';
  END IF;

  -- 2. Update the document for this student and type
  -- We update the most recent one if multiple exist, or just the matching type
  -- Generally there should be one active 'pending' or 'approved'doc.
  
  -- We'll update the latest one created.
  
  UPDATE public.student_documents
  SET 
    document_number = p_metadata->>'document_number',
    expiration_date = (p_metadata->>'expiration_date')::DATE,
    metadata = coalesce(metadata, '{}'::jsonb) || p_metadata
  WHERE id = (
      SELECT id FROM public.student_documents
      WHERE student_id = v_student_id 
        AND document_type = p_document_type
      ORDER BY created_at DESC
      LIMIT 1
  )
  RETURNING * INTO v_doc_record;

  IF v_doc_record IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'Document not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'data', row_to_json(v_doc_record));
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.update_document_metadata_via_token(TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.update_document_metadata_via_token(TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_document_metadata_via_token(TEXT, TEXT, JSONB) TO service_role;
