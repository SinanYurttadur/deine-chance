import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import usePageTitle from '../hooks/usePageTitle';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  usePageTitle('Neues Passwort');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let checkCount = 0;
    let pollIntervalId = null;
    const maxChecks = 10;

    const checkForSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return false;

      if (session) {
        setIsReady(true);
        window.history.replaceState({}, '', '/passwort-neu');
        return true;
      }

      return false;
    };

    const handleRecovery = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          const hasSession = await checkForSession();
          if (!hasSession && isMounted) {
            setError('Kein gültiger Reset-Link gefunden.');
          }
          return;
        }

        pollIntervalId = setInterval(async () => {
          checkCount++;
          const hasSession = await checkForSession();

          if (hasSession || checkCount >= maxChecks) {
            clearInterval(pollIntervalId);
            pollIntervalId = null;

            if (!hasSession && isMounted) {
              const refreshToken = params.get('refresh_token');

              const { data } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              });

              if (data?.session && isMounted) {
                setIsReady(true);
                window.history.replaceState({}, '', '/passwort-neu');
              } else if (isMounted) {
                setError('Der Link ist ungültig oder abgelaufen.');
              }
            }
          }
        }, 300);

      } catch {
        if (isMounted) {
          setError('Ein Fehler ist aufgetreten.');
        }
      }
    };

    handleRecovery();

    return () => {
      isMounted = false;
      if (pollIntervalId) clearInterval(pollIntervalId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen haben');
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Das Passwort muss mindestens einen Großbuchstaben und eine Zahl enthalten');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Passwort geändert!</h1>
          <p className="text-gray-600 mb-6">Du wirst zum Login weitergeleitet...</p>
          <Link to="/login" className="inline-block w-full bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-4 rounded-xl font-semibold transition-colors text-center">
            Jetzt einloggen
          </Link>
        </div>
      </div>
    );
  }

  // Loading
  if (!isReady && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-swiss-red animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Link wird überprüft...</p>
        </div>
      </div>
    );
  }

  // Error
  if (!isReady && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Link ungültig</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/passwort-vergessen" className="inline-block w-full bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-4 rounded-xl font-semibold transition-colors text-center">
            Neuen Link anfordern
          </Link>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-swiss-red rounded-xl flex items-center justify-center relative">
            <div className="absolute w-7 h-2 bg-white"></div>
            <div className="absolute w-2 h-7 bg-white"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Neues Passwort</h1>
        <p className="text-gray-600 text-center mb-8">Gib dein neues Passwort ein.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Neues Passwort</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none"
                placeholder="Mind. 8 Zeichen, Großbuchstabe + Zahl"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passwort bestätigen</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none"
                placeholder="Passwort wiederholen"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password || !passwordConfirm}
            className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              'Passwort speichern'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
