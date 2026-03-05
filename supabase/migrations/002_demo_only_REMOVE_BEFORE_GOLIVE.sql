-- ============================================================
-- DEMO-ONLY: Diese Migration VOR Go-Live entfernen!
-- Erlaubt Demo-Checkout ohne Stripe-Zahlung.
-- ============================================================
-- Zum Entfernen in Supabase SQL Editor ausführen:
--   DROP FUNCTION IF EXISTS demo_activate_membership();
-- ============================================================

CREATE OR REPLACE FUNCTION demo_activate_membership()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cert_number TEXT;
BEGIN
  PERFORM set_config('app.bypass_protection', 'true', true);

  cert_number := 'DC-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' ||
    LPAD(floor(random() * 90000 + 10000)::TEXT, 5, '0');

  UPDATE profiles
  SET
    membership_status = 'active',
    paid_at = NOW(),
    paid_amount = 0,
    access_granted_at = NOW(),
    certificate_number = COALESCE(certificate_number, cert_number)
  WHERE id = auth.uid()
    AND membership_status IN ('pending', 'cancelled');
END;
$$;

GRANT EXECUTE ON FUNCTION demo_activate_membership TO authenticated;
