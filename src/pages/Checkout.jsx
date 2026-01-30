import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { isStripeConfigured, MEMBERSHIP_PRODUCT } from '../lib/stripe';
import {
  CreditCard,
  Building2,
  Wallet,
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, getPendingRegistration } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const stripeReady = isStripeConfigured();

  // Lade pending registration falls vorhanden
  useEffect(() => {
    const pending = getPendingRegistration();
    if (pending) {
      setPendingUser(pending);
    }
  }, []);

  // Bereits aktive Mitgliedschaft -> direkt zum Portal
  useEffect(() => {
    if (!isLoading && profile?.membership_status === 'active') {
      navigate('/portal', { replace: true });
    }
  }, [isLoading, profile, navigate]);

  // Stripe Checkout starten
  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Supabase Edge Function aufrufen
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout', {
        body: {
          userId: user.id,
          email: user.email,
          successUrl: `${window.location.origin}/willkommen?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`
        }
      });

      if (fnError) throw fnError;

      if (data?.url) {
        // Zu Stripe Checkout weiterleiten
        window.location.href = data.url;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (err) {
      setError(err.message || 'Checkout konnte nicht gestartet werden');
      setIsProcessing(false);
    }
  };

  // Demo-Modus: Zahlung simulieren
  const handleDemoCheckout = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Warte auf Auth falls noch nicht geladen
      let currentUser = user;
      if (!currentUser?.id) {
        // Versuche Session zu holen
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          currentUser = session.user;
        } else {
          throw new Error('Bitte melde dich zuerst an');
        }
      }

      // Simuliere kurze Verarbeitung
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Zertifikatsnummer generieren mit crypto für bessere Einzigartigkeit
      const year = new Date().getFullYear();
      const random = crypto.getRandomValues(new Uint32Array(1))[0] % 90000 + 10000;
      const certificateNumber = `DC-${year}-${random}`;

      // Upsert: Erstellt oder aktualisiert atomar (keine Race Condition)
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          first_name: currentUser.user_metadata?.first_name || pendingUser?.firstName,
          last_name: currentUser.user_metadata?.last_name || pendingUser?.lastName,
          membership_status: 'active',
          paid_at: new Date().toISOString(),
          paid_amount: 249,
          access_granted_at: new Date().toISOString(),
          certificate_number: certificateNumber
        }, { onConflict: 'id' });

      if (upsertError) {
        throw new Error('Profil konnte nicht aktualisiert werden');
      }

      navigate('/willkommen');
    } catch (err) {
      setError(err.message || 'Fehler bei der Verarbeitung');
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stripeReady) {
      handleStripeCheckout();
    } else {
      handleDemoCheckout();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-swiss-red animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    );
  }


  // Nutze pending data als Fallback für Anzeige
  const displayName = user?.firstName || user?.user_metadata?.first_name || pendingUser?.firstName || '';
  const displayLastName = user?.lastName || user?.user_metadata?.last_name || pendingUser?.lastName || '';
  const displayEmail = user?.email || pendingUser?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/portal"
          className="inline-flex items-center text-gray-600 hover:text-swiss-red mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-green-500 text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="w-20 h-1 bg-green-500"></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-swiss-red text-white">
              2
            </div>
            <div className="w-20 h-1 bg-gray-200"></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-500">
              3
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Schritt 2: Zahlung</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Mitgliedschaft aktivieren
              </h1>

              {/* Stripe Ready - Zeige Checkout Button */}
              {stripeReady ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-swiss-red rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Sichere Zahlung</p>
                        <p className="text-sm text-gray-500">Kreditkarte, SEPA, PayPal & mehr</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Du wirst zu unserem sicheren Zahlungspartner Stripe weitergeleitet.
                      Alle gängigen Zahlungsmethoden werden akzeptiert.
                    </p>
                  </div>

                  {/* Zahlungsmethoden Icons */}
                  <div className="flex items-center justify-center gap-4 py-4">
                    <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/visa.svg" alt="Visa" className="h-8 opacity-60" onError={(e) => e.target.style.display='none'} />
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">MC</div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">SEPA</div>
                    <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">PayPal</div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Weiterleitung zu Stripe...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Jetzt 249€ bezahlen
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Demo Mode */
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Demo-Modus aktiv</p>
                        <p className="text-sm text-yellow-700">
                          Stripe ist noch nicht konfiguriert. Klicke auf den Button um die Mitgliedschaft im Demo-Modus zu aktivieren.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Test-Zahlung</p>
                        <p className="text-sm text-gray-500">Keine echte Abbuchung</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wird aktiviert...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Demo: Mitgliedschaft aktivieren
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Security Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Sicher bezahlen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Deine Bestellung
              </h2>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-medium text-gray-900">
                  {displayName} {displayLastName}
                </p>
                <p className="text-sm text-gray-500">{displayEmail}</p>
              </div>

              {/* Product */}
              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Mitgliedschaft</p>
                    <p className="text-sm text-gray-500">Deine Chance e.V.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">249€</p>
                    <p className="text-sm text-gray-400 line-through">499€</p>
                  </div>
                </div>
              </div>

              {/* Included */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-700">Inklusive:</p>
                {[
                  'Lebenslanger Plattformzugang',
                  'Jobplattform & Stellenangebote',
                  'Dokumentenvorlagen',
                  'Community-Zugang',
                  'Persönlicher Support',
                  'Mitgliedschaftszertifikat'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gray-900 text-white rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Gesamtsumme</span>
                  <span className="text-2xl font-bold">249€</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Einmalzahlung, kein Abo</p>
              </div>

              {/* Guarantee */}
              <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 text-sm">14 Tage Geld-zurück-Garantie</p>
                  <p className="text-xs text-green-600">Nicht zufrieden? Volle Erstattung ohne Fragen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
