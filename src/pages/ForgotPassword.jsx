import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  usePageTitle('Passwort vergessen');
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await resetPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Ein Fehler ist aufgetreten');
    }
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              E-Mail gesendet!
            </h1>
            <p className="text-gray-600 mb-6">
              Wir haben dir einen Link zum Zurücksetzen deines Passworts an <strong>{email}</strong> gesendet.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>Tipp:</strong> Schau auch in deinem Spam-Ordner nach, falls du keine E-Mail findest.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center text-gray-600 hover:text-swiss-red mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Login
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* Logo mit Schweizer Kreuz */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-swiss-red rounded-xl flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-6 bg-white rounded-[1px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-2.5 bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
            Passwort vergessen?
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Kein Problem! Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                  placeholder="max@beispiel.de"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Wird gesendet...
                </>
              ) : (
                'Link senden'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Erinnerst du dich wieder?{' '}
              <Link to="/login" className="text-swiss-red font-semibold hover:underline">
                Zum Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
