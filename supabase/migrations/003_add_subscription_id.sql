-- ============================================================
-- Subscription-ID Spalte für Jahres-Abo
-- Speichert die Stripe Subscription ID für Kündigung via Stripe API
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Trigger erweitern: stripe_subscription_id vor Client-Änderungen schützen
CREATE OR REPLACE FUNCTION protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. SECURITY DEFINER Funktionen setzen diesen Flag um den Trigger zu umgehen
  IF current_setting('app.bypass_protection', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- 2. service_role (Stripe Webhook, Admin) darf alles ändern
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- 3. Für normale User: Geschützte Felder silently auf alten Wert zurücksetzen
  NEW.membership_status := OLD.membership_status;
  NEW.paid_at := OLD.paid_at;
  NEW.paid_amount := OLD.paid_amount;
  NEW.access_granted_at := OLD.access_granted_at;
  NEW.stripe_session_id := OLD.stripe_session_id;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.certificate_number := OLD.certificate_number;
  NEW.cancelled_at := OLD.cancelled_at;
  NEW.cancellation_reason := OLD.cancellation_reason;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
