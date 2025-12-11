import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, Briefcase, ArrowRight, ArrowLeft, CheckCircle, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    currentCountry: '',
    profession: '',
    acceptTerms: false,
    acceptNewsletter: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Vorname ist erforderlich';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nachname ist erforderlich';
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }
    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen haben';
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwörter stimmen nicht überein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.currentCountry) newErrors.currentCountry = 'Bitte wähle dein Land';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Du musst die AGB akzeptieren';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      // Register user (pending status until payment)
      const newUser = register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        currentCountry: formData.currentCountry,
        profession: formData.profession,
        newsletter: formData.acceptNewsletter
      });

      // Navigate to checkout
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
    } catch (error) {
      setErrors({ submit: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-swiss-red mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Startseite
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-swiss-red text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-swiss-red' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-swiss-red text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <div className="w-20 h-1 bg-gray-200"></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-500">
              3
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            {step === 1 ? 'Schritt 1: Persönliche Daten' : 'Schritt 2: Zusätzliche Infos'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-swiss-red rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">DC</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
            Mitglied werden
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Erstelle dein Konto und starte deine Reise in die Schweiz
          </p>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vorname *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all`}
                        placeholder="Max"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all`}
                      placeholder="Mustermann"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adresse *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all`}
                      placeholder="max@beispiel.de"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passwort *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all`}
                      placeholder="Mindestens 6 Zeichen"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Password Confirm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passwort bestätigen *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-200'} focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all`}
                      placeholder="Passwort wiederholen"
                    />
                  </div>
                  {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Weiter
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer (optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktuelles Wohnsitzland *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="currentCountry"
                      value={formData.currentCountry}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.currentCountry ? 'border-red-500' : 'border-gray-200'} focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all bg-white`}
                    >
                      <option value="">Bitte auswählen</option>
                      <option value="DE">Deutschland</option>
                      <option value="AT">Österreich</option>
                      <option value="IT">Italien</option>
                      <option value="FR">Frankreich</option>
                      <option value="OTHER">Anderes Land</option>
                    </select>
                  </div>
                  {errors.currentCountry && <p className="text-red-500 text-sm mt-1">{errors.currentCountry}</p>}
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktuelle Berufsbezeichnung (optional)
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                      placeholder="z.B. Software-Entwickler"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-3 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-swiss-red focus:ring-swiss-red"
                    />
                    <span className="text-sm text-gray-600">
                      Ich akzeptiere die{' '}
                      <a href="/agb" className="text-swiss-red hover:underline">AGB</a>
                      {' '}und{' '}
                      <a href="/datenschutz" className="text-swiss-red hover:underline">Datenschutzerklärung</a> *
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptNewsletter"
                      checked={formData.acceptNewsletter}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-swiss-red focus:ring-swiss-red"
                    />
                    <span className="text-sm text-gray-600">
                      Ich möchte den Newsletter mit Tipps zur Auswanderung erhalten (optional)
                    </span>
                  </label>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                    {errors.submit}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Zurück
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wird verarbeitet...
                      </>
                    ) : (
                      <>
                        Zur Zahlung
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Bereits Mitglied?{' '}
              <Link to="/login" className="text-swiss-red font-semibold hover:underline">
                Hier einloggen
              </Link>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SSL-verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>DSGVO-konform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
