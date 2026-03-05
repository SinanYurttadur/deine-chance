-- ============================================================
-- RLS Policies für profiles Tabelle
-- WICHTIG: Verhindert, dass User ihre eigene Mitgliedschaft
-- client-seitig aktivieren können.
-- ============================================================

-- RLS aktivieren
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Bestehende Policies entfernen (falls vorhanden)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own safe fields" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 1. User dürfen ihr eigenes Profil lesen
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. User dürfen ihr eigenes Profil updaten (Spalten-Schutz über Trigger unten)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. User dürfen ihr Profil erstellen (Registrierung)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- TRIGGER: Schützt sensible Spalten vor Client-seitigen Änderungen
-- RLS ist nur row-level, kann keine einzelnen Spalten schützen.
-- Dieser Trigger revertiert geschützte Felder auf ihren alten Wert,
-- es sei denn, ein SECURITY DEFINER-Funktion hat den Bypass gesetzt.
-- ============================================================
CREATE OR REPLACE FUNCTION protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. SECURITY DEFINER Funktionen setzen diesen Flag um den Trigger zu umgehen
  IF current_setting('app.bypass_protection', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- 2. service_role (Stripe Webhook, Admin) darf alles ändern
  --    service_role umgeht RLS, aber NICHT Trigger → hier explizit erlauben
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
  NEW.certificate_number := OLD.certificate_number;
  NEW.cancelled_at := OLD.cancelled_at;
  NEW.cancellation_reason := OLD.cancellation_reason;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_profile_sensitive_fields ON profiles;
CREATE TRIGGER protect_profile_sensitive_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_fields();

-- ============================================================
-- SECURITY DEFINER Funktionen (umgehen Trigger via bypass flag)
-- ============================================================

-- Profil-Update: Nur sichere Felder (first_name, last_name, phone)
CREATE OR REPLACE FUNCTION update_own_profile(
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    first_name = COALESCE(p_first_name, first_name),
    last_name = COALESCE(p_last_name, last_name),
    phone = COALESCE(p_phone, phone)
  WHERE id = auth.uid();
END;
$$;

-- Kündigung: membership_status → 'cancelled'
CREATE OR REPLACE FUNCTION cancel_own_membership(p_reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.bypass_protection', 'true', true);

  UPDATE profiles
  SET
    membership_status = 'cancelled',
    cancelled_at = NOW(),
    cancellation_reason = p_reason
  WHERE id = auth.uid()
    AND membership_status = 'active';
END;
$$;

-- Membership-Aktivierung durch service_role (Stripe Webhook):
-- service_role umgeht RLS, aber NICHT Trigger.
-- Der Trigger erkennt service_role und lässt alle Änderungen durch.

-- Grants
GRANT EXECUTE ON FUNCTION update_own_profile TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_own_membership TO authenticated;
