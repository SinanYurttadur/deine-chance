import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import usePageTitle from '../hooks/usePageTitle';
import {
  ArrowLeft,
  Shield,
  Lock,
  AlertCircle,
  Loader2,
  Briefcase,
  FileText,
  Users,
  HeadphonesIcon,
  Award,
  RefreshCw,
  Clock,
  RotateCcw
} from 'lucide-react';

const INCLUDED_FEATURES = [
  { icon: Clock, label: '12 Monate Vollzugang' },
  { icon: Briefcase, label: 'Jobplattform & Stellenangebote' },
  { icon: FileText, label: 'Dokumentenvorlagen' },
  { icon: Users, label: 'Community-Zugang' },
  { icon: HeadphonesIcon, label: 'Persönlicher Support' },
  { icon: Award, label: 'Mitgliedschaftszertifikat' },
];

const Checkout = () => {
  usePageTitle('Checkout');
  const navigate = useNavigate();
  const { user, profile, isLoading, getPendingRegistration, hasActiveMembership } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const pending = getPendingRegistration();
    if (pending) setPendingUser(pending);
  }, []);

  // Debug: Profil-Status + direkte Tests
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'NICHT GESETZT';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const info = {
      authLoading: isLoading,
      userId: user?.id || 'null',
      profileStatus: profile?.membership_status || 'null (Profil nicht geladen)',
      hasActive: hasActiveMembership(),
      supabaseUrl: supabaseUrl,
    };
    setDebugInfo(info);

    if (!isLoading && user?.id) {
      // Test: Raw fetch (umgeht Supabase Client komplett)
      const url = `${supabaseUrl}/rest/v1/profiles?select=membership_status&id=eq.${user.id}`;
      fetch(url, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setDebugInfo(prev => ({
            ...prev,
            'rawFetch': Array.isArray(data) && data.length > 0
              ? `OK: ${data[0]?.membership_status}`
              : `Leer/Fehler: ${JSON.stringify(data).slice(0, 100)}`,
          }));
        })
        .catch(err => {
          setDebugInfo(prev => ({
            ...prev,
            'rawFetch': `NETZWERK-FEHLER: ${err.message}`,
          }));
        });

      // Test: Session Token
      supabase.auth.getSession().then(({ data }) => {
        const token = data?.session?.access_token;
        if (token) {
          // Nochmal mit echtem User-Token
          fetch(`${supabaseUrl}/rest/v1/profiles?select=membership_status&id=eq.${user.id}`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(res => res.json())
            .then(data => {
              setDebugInfo(prev => ({
                ...prev,
                'rawFetch.auth': Array.isArray(data) && data.length > 0
                  ? `OK: ${data[0]?.membership_status}`
                  : `Leer/Fehler: ${JSON.stringify(data).slice(0, 100)}`,
                'session.token': `vorhanden`,
              }));
            })
            .catch(err => {
              setDebugInfo(prev => ({
                ...prev,
                'rawFetch.auth': `NETZWERK-FEHLER: ${err.message}`,
              }));
            });
        } else {
          setDebugInfo(prev => ({ ...prev, 'session.token': 'FEHLT' }));
        }
      });
    }
  }, [isLoading, user, profile]);

  // Mitgliedschaft prüfen und aktive Mitglieder zum Portal weiterleiten
  useEffect(() => {
    if (isLoading) return;

    // 1) AuthContext hat Profil → sofort weiterleiten
    if (hasActiveMembership()) {
      navigate('/portal', { replace: true });
      return;
    }

    // 2) Kein Profil trotz Auth → direkte DB-Abfrage
    const checkDirectly = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setDebugInfo(prev => ({ ...prev, directCheck: 'Keine Session' }));
          return;
        }

        const { data, error: queryError } = await supabase
          .from('profiles')
          .select('membership_status')
          .eq('id', session.user.id)
          .single();

        if (queryError) {
          setDebugInfo(prev => ({
            ...prev,
            directCheck: `DB-Fehler: ${queryError.code} – ${queryError.message}`,
          }));
          console.error('Checkout: Profil-Query fehlgeschlagen:', queryError);
          return;
        }

        setDebugInfo(prev => ({
          ...prev,
          directCheck: `OK → membership_status = "${data?.membership_status}"`,
        }));

        if (data?.membership_status === 'active') {
          navigate('/portal', { replace: true });
        }
      } catch (err) {
        setDebugInfo(prev => ({ ...prev, directCheck: `Exception: ${err.message}` }));
      }
    };

    // Nur prüfen wenn User eingeloggt aber Profil fehlt oder nicht active
    if (user?.id) {
      checkDirectly();
    }
  }, [isLoading, profile, navigate, user]);

  const handleStripeCheckout = useCallback(async () => {
    setIsProcessing(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('Bitte melde dich zuerst an.');
      }

      // Session mit eigenem Timeout holen
      let session;
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 8000)
          ),
        ]);
        session = result.data?.session;
      } catch {
        throw new Error('Sitzung konnte nicht geladen werden. Bitte lade die Seite neu.');
      }

      if (!session?.access_token) {
        throw new Error('Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.');
      }

      setDebugInfo(prev => ({ ...prev, stripeStep: 'Session OK, rufe API...' }));

      // API-Call mit Timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      let response;
      try {
        response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr.name === 'AbortError') {
          throw new Error('Server antwortet nicht (Timeout). Bitte versuche es erneut.');
        }
        throw new Error(`Verbindung fehlgeschlagen: ${fetchErr.message}`);
      } finally {
        clearTimeout(timeout);
      }

      setDebugInfo(prev => ({ ...prev, stripeStep: `API antwortete: ${response.status}` }));

      // Antwort parsen
      let data;
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Checkout API: Nicht-JSON Antwort:', response.status, text.slice(0, 200));
        throw new Error(`Server-Fehler (${response.status}). Bitte versuche es später erneut.`);
      }

      try {
        data = await response.json();
      } catch {
        throw new Error('Ungültige Serverantwort. Bitte versuche es später erneut.');
      }

      if (!response.ok) {
        console.error('Checkout API Fehler:', response.status, data);
        throw new Error(data?.error || `Checkout fehlgeschlagen (${response.status}).`);
      }

      if (!data?.url) {
        throw new Error('Keine Checkout-URL erhalten.');
      }

      // Zu Stripe weiterleiten
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout Fehler:', err);
      setDebugInfo(prev => ({ ...prev, stripeStep: `FEHLER: ${err.message}` }));
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
      setIsProcessing(false);
    }
  }, [user]);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-swiss-red animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.firstName || user?.user_metadata?.first_name || pendingUser?.firstName || '';
  const displayLastName = user?.lastName || user?.user_metadata?.last_name || pendingUser?.lastName || '';
  const displayEmail = user?.email || pendingUser?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-8 px-4 sm:py-12">
      <div className="max-w-lg mx-auto">

        {/* DEBUG PANEL – nach Debugging entfernen */}
        {Object.keys(debugInfo).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-4 text-xs font-mono">
            <p className="font-bold text-yellow-800 mb-2">Debug Info (temporär):</p>
            {Object.entries(debugInfo).map(([key, val]) => (
              <p key={key} className="text-yellow-700">
                <span className="font-semibold">{key}:</span> {String(val)}
              </p>
            ))}
          </div>
        )}

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-500 hover:text-swiss-red mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Zurück
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gray-900 text-white px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">Mitgliedschaft aktivieren</h1>
                <p className="text-gray-400 text-sm mt-0.5">Deine Chance e.V.</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">249€</p>
                <p className="text-gray-400 text-xs">pro Jahr</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">

            {/* User Info */}
            {displayEmail && (
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-swiss-red/10 flex items-center justify-center text-swiss-red font-semibold text-sm">
                  {displayName?.[0]?.toUpperCase() || displayEmail[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  {displayName && (
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {displayName} {displayLastName}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm truncate">{displayEmail}</p>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Inklusive
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {INCLUDED_FEATURES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee + No auto-renew */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-800 font-medium">14 Tage Geld-zurück</span>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                <RefreshCw className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs text-blue-800 font-medium">Keine Auto-Verlängerung</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-5 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">Fehler beim Checkout</p>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { setError(''); setIsProcessing(false); }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Erneut versuchen
                  </button>
                  {error.includes('Sitzung') && (
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Zum Login
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleStripeCheckout}
              disabled={isProcessing}
              className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-red-200/50 hover:shadow-red-300/50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Weiterleitung zu Stripe…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Jetzt Mitglied werden – 249€/Jahr
                </>
              )}
            </button>

            {/* Payment methods + security */}
            <div className="mt-5 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="h-7 px-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500 tracking-wide">VISA</div>
                <div className="h-7 px-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500 tracking-wide">MASTERCARD</div>
                <div className="h-7 px-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500 tracking-wide">SEPA</div>
              </div>
              <div className="flex items-center gap-4 text-gray-400 text-xs">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  256-bit SSL
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Sichere Zahlung via Stripe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
