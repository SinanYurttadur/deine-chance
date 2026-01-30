import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { Mail, Lock, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  usePageTitle('Anmelden');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Wohin nach dem Login? Nur interne Pfade erlauben
  const ALLOWED_REDIRECTS = ['/portal', '/checkout', '/willkommen', '/kuendigen'];
  const requestedPath = location.state?.from;
  const redirectTo = ALLOWED_REDIRECTS.includes(requestedPath) ? requestedPath : '/portal';
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(redirectTo);
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-swiss-red mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Startseite
        </Link>

        {/* Login Card */}
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
            Willkommen zurück
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Melde dich an um auf dein Portal zuzugreifen
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
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                  placeholder="max@beispiel.de"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                  placeholder="Dein Passwort"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link to="/passwort-vergessen" className="text-sm text-swiss-red hover:underline">
                Passwort vergessen?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Wird angemeldet...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Noch kein Mitglied?{' '}
              <Link to="/register" className="text-swiss-red font-semibold hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Shield className="w-4 h-4" />
            <span>Sichere Verbindung</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
