ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS educational_id TEXT;

-- Update view to include educational_id
DROP VIEW IF EXISTS public.student_balances;

CREATE OR REPLACE VIEW public.student_balances AS
SELECT 
    s.id AS student_id,
    s.human_id,
    s.first_name,
    s.last_name,
    s.email,
    s.phone,
    s.educational_id, -- New column
    s.created_at,
    s.medical_profile,
    s.logistics_profile,
    COALESCE(SUM(CASE WHEN fl.type = 'charge' THEN fl.amount ELSE 0 END), 0) AS total_charges,
    COALESCE(SUM(CASE WHEN fl.type = 'payment' THEN fl.amount ELSE 0 END), 0) AS total_payments,
    (COALESCE(SUM(CASE WHEN fl.type = 'charge' THEN fl.amount ELSE 0 END), 0) - 
     COALESCE(SUM(CASE WHEN fl.type = 'payment' THEN fl.amount ELSE 0 END), 0)) AS balance
FROM public.students s
LEFT JOIN public.finance_ledger fl ON s.id = fl.student_id
GROUP BY s.id;
