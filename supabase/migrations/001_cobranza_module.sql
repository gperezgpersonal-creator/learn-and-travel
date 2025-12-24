-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    human_id TEXT UNIQUE,
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to generate human_id (e.g. C1001)
CREATE OR REPLACE FUNCTION public.generate_student_human_id()
RETURNS TRIGGER AS $$
DECLARE
    next_id INT;
BEGIN
    SELECT count(*) + 1000 INTO next_id FROM public.students;
    NEW.human_id := 'C' || next_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for human_id
CREATE TRIGGER set_student_human_id
BEFORE INSERT ON public.students
FOR EACH ROW
WHEN (NEW.human_id IS NULL)
EXECUTE FUNCTION public.generate_student_human_id();

-- Create stripe_staging_area table
CREATE TABLE IF NOT EXISTS public.stripe_staging_area (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_charge_id TEXT UNIQUE NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT CHECK (status IN ('pending', 'reconciled')) DEFAULT 'pending',
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create finance_ledger table
CREATE TABLE IF NOT EXISTS public.finance_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) NOT NULL,
    type TEXT CHECK (type IN ('charge', 'payment')) NOT NULL,
    amount NUMERIC NOT NULL,
    concept TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_balances VIEW
CREATE OR REPLACE VIEW public.student_balances AS
SELECT 
    s.id AS student_id,
    s.human_id,
    s.first_name,
    s.last_name,
    COALESCE(SUM(CASE WHEN fl.type = 'charge' THEN fl.amount ELSE 0 END), 0) AS total_charges,
    COALESCE(SUM(CASE WHEN fl.type = 'payment' THEN fl.amount ELSE 0 END), 0) AS total_payments,
    (COALESCE(SUM(CASE WHEN fl.type = 'charge' THEN fl.amount ELSE 0 END), 0) - 
     COALESCE(SUM(CASE WHEN fl.type = 'payment' THEN fl.amount ELSE 0 END), 0)) AS balance
FROM public.students s
LEFT JOIN public.finance_ledger fl ON s.id = fl.student_id
GROUP BY s.id;

-- RPC Function for Reconciliation
CREATE OR REPLACE FUNCTION public.reconcile_payment(payment_id UUID, target_student_id UUID)
RETURNS VOID AS $$
DECLARE
    payment_record RECORD;
BEGIN
    -- Get payment info
    SELECT * INTO payment_record FROM public.stripe_staging_area WHERE id = payment_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    IF payment_record.status = 'reconciled' THEN
        RAISE EXCEPTION 'Payment already reconciled';
    END IF;

    -- Update staging status
    UPDATE public.stripe_staging_area 
    SET status = 'reconciled' 
    WHERE id = payment_id;

    -- Insert into ledger
    INSERT INTO public.finance_ledger (student_id, type, amount, concept, metadata)
    VALUES (
        target_student_id, 
        'payment', 
        payment_record.amount, 
        'Stripe Payment ' || payment_record.stripe_charge_id, 
        jsonb_build_object('source', 'stripe', 'original_id', payment_record.id, 'stripe_id', payment_record.stripe_charge_id)
    );
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_staging_area ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_ledger ENABLE ROW LEVEL SECURITY;

-- Policy: Allow full access to authenticated staff/admin users (simplified for now as "authenticated")
CREATE POLICY "Enable all for authenticated users" ON public.students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.stripe_staging_area FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.finance_ledger FOR ALL USING (auth.role() = 'authenticated');
