-- Add new columns to finance_ledger for better manual payment control
ALTER TABLE public.finance_ledger 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'stripe',
ADD COLUMN IF NOT EXISTS occurred_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have occurred_at = created_at
UPDATE public.finance_ledger 
SET occurred_at = created_at 
WHERE occurred_at IS NULL;

-- Make sure occurred_at is indexed as we will likely sort by it
CREATE INDEX IF NOT EXISTS idx_finance_ledger_occurred_at ON public.finance_ledger(occurred_at);

-- Add comment
COMMENT ON COLUMN public.finance_ledger.payment_method IS 'Method of payment: stripe, cash, transfer, etc.';
COMMENT ON COLUMN public.finance_ledger.occurred_at IS 'When the transaction actually happened (can be different from created_at for manual entries)';
