-- 004_unreconcile_payment.sql
-- Function to reverse a payment (unreconcile)

CREATE OR REPLACE FUNCTION public.unreconcile_payment(ledger_entry_id UUID)
RETURNS VOID AS $$
DECLARE
    v_ledger_record RECORD;
    v_original_id UUID;
    v_source TEXT;
BEGIN
    -- 1. Get the ledger entry details
    SELECT * INTO v_ledger_record 
    FROM public.finance_ledger 
    WHERE id = ledger_entry_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Ledger entry not found';
    END IF;

    -- 2. Extract metadata
    -- Note: metadata is JSONB. We use ->> to get text value.
    v_source := v_ledger_record.metadata->>'source';
    v_original_id := (v_ledger_record.metadata->>'original_id')::UUID;

    -- 3. If it is a Stripe payment, return it to the Inbox (Staging Area)
    IF v_source = 'stripe' AND v_original_id IS NOT NULL THEN
        UPDATE public.stripe_staging_area
        SET status = 'pending'
        WHERE id = v_original_id;
        
        -- Optional: Verify if update happened? 
        -- If the staging record was deleted manually, we just delete the ledger entry.
    END IF;

    -- 4. Delete the ledger entry (Reverse the transaction)
    DELETE FROM public.finance_ledger
    WHERE id = ledger_entry_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
