-- FIX: Ensure columns exist (from 002 migration) regardless of previous runs
ALTER TABLE public.finance_ledger 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'stripe',
ADD COLUMN IF NOT EXISTS occurred_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have occurred_at = created_at if null
UPDATE public.finance_ledger 
SET occurred_at = created_at 
WHERE occurred_at IS NULL;

-- Update reconcile_payment function to use better concept logic
CREATE OR REPLACE FUNCTION public.reconcile_payment(payment_id UUID, target_student_id UUID)
RETURNS VOID AS $$
DECLARE
    payment_record RECORD;
    v_concept TEXT;
BEGIN
    -- Get payment info
    SELECT * INTO payment_record FROM public.stripe_staging_area WHERE id = payment_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    IF payment_record.status = 'reconciled' THEN
        RAISE EXCEPTION 'Payment already reconciled';
    END IF;

    -- Determine Concept Preference:
    -- 1. metadata->program (Our enhanced sync)
    -- 2. metadata->programName (Our checkout sync)
    -- 3. description (Stripe Product Name)
    -- Determinar el Concepto: Prioridad al nombre del programa + descripción del plan
    v_concept := COALESCE(
        payment_record.raw_data->'metadata'->>'program',
        payment_record.raw_data->'metadata'->>'programName',
        payment_record.raw_data->>'description',
        'Stripe Payment ' || payment_record.stripe_charge_id
    );

    -- Append Plan Description if available (e.g. " - Plan: Apartado")
    IF payment_record.raw_data->'metadata'->>'planDescription' IS NOT NULL THEN
        v_concept := v_concept || ' - ' || (payment_record.raw_data->'metadata'->>'planDescription');
    END IF;

    -- Update staging status
    UPDATE public.stripe_staging_area 
    SET status = 'reconciled' 
    WHERE id = payment_id;

    -- Insert into ledger
    INSERT INTO public.finance_ledger (student_id, type, amount, concept, metadata, occurred_at)
    VALUES (
        target_student_id, 
        'payment', 
        payment_record.amount, 
        v_concept, 
        jsonb_build_object(
            'source', 'stripe', 
            'original_id', payment_record.id, 
            'stripe_id', payment_record.stripe_charge_id,
            'original_metadata', payment_record.raw_data->'metadata'
        ),
        payment_record.created_at -- Use the original payment date
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
