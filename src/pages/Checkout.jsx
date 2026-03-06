import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import usePageTitle from '../hooks/usePageTitle';
import {
  CreditCard,
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  FileText,
  Users,
  HeadphonesIcon,
  Award,
  RefreshCw,
  Clock
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
  const { user, profile, isLoading, getPendingRegistration, hasActiveMembership, refreshMembership } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    const pending = getPendingRegistration();
    if (pending) setPendingUser(pending);
  }, []);

  // Bereits aktive Mitgliedschaft -> direkt zum Portal
  // Falls Profil nicht geladen: einmal nachladen als Fallback
  useEffect(() => {
    if (!isLoading && hasActiveMembership()) {
      navigate('/portal', { replace: true });
      return;
    }
    // Profil fehlt trotz eingeloggtem User → einmal nachladen
    if (!isLoading && user?.id && !profile) {
      refreshMembership().then(({ status }) => {
        if (status === 'active') {
          navigate('/portal', { replace: true });
        }
      });
    }
  }, [isLoading, profile, navigate, user]);

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('Bitte melde dich zuerst an.');
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.');
      }

      // Fetch mit Timeout (20s) damit der Button nicht ewig dreht
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
          throw new Error('Die Verbindung hat zu lange gedauert. Bitte versuche es erneut.');
        }
        throw new Error('Verbindung zum Server fehlgeschlagen. Bitte prüfe deine Internetverbindung.');
      } finally {
        clearTimeout(timeout);
      }

      // Sicherstellen, dass die Antwort JSON ist
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Unerwartete Serverantwort. Bitte versuche es später erneut.');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Checkout konnte nicht gestartet werden.');
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Keine Checkout-URL erhalten. Bitte versuche es erneut.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
      setIsProcessing(false);
    }
  };

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
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-5 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  {error.includes('Sitzung') && (
                    <Link to="/login" className="text-red-800 underline font-medium mt-1 inline-block">
                      Zum Login →
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
