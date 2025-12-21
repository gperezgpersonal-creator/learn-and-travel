-- Ensure the Orlando program exists so the website can find it
INSERT INTO public.programs (id, internal_id, title, slug, price, currency, status, plans_json)
VALUES (
  '84-ORL2026',
  '84-ORL2026',
  'The Way to Do Business - Orlando ABRIL 2026',
  'orlando-business-2026',
  2950,
  'USD',
  'published',
  '[{"name": "Apartado", "price": 50, "status": "active"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Verification
SELECT * FROM public.programs WHERE id = '84-ORL2026';
