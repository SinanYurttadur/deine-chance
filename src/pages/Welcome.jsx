import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, PartyPopper, Download, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF0000', '#FFFFFF', '#FFD700']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF0000', '#FFFFFF', '#FFD700']
      });
    }, 250);

    setTimeout(() => setShowContent(true), 500);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center py-12 px-4">
      <div className={`max-w-2xl w-full transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <PartyPopper className="w-5 h-5 text-yellow-800" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Willkommen bei Deine Chance! 🎉
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Herzlichen Glückwunsch, <span className="font-semibold text-swiss-red">{user.firstName}</span>!
            Deine Mitgliedschaft ist jetzt aktiv.
          </p>

          {/* Membership Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
            {/* Swiss cross watermark */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <svg viewBox="0 0 100 100">
                <rect x="35" y="10" width="30" height="80" fill="currentColor" />
                <rect x="10" y="35" width="80" height="30" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-swiss-red rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">DC</span>
                  </div>
                  <span className="font-semibold">Deine Chance e.V.</span>
                </div>
                <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Aktiv</span>
                </div>
              </div>

              <div className="text-left space-y-1">
                <p className="text-gray-400 text-sm">Mitglied</p>
                <p className="text-xl font-semibold">{user.firstName} {user.lastName}</p>
              </div>

              <div className="flex justify-between items-end mt-6">
                <div>
                  <p className="text-gray-400 text-xs">Mitgliedsnummer</p>
                  <p className="font-mono">{user.certificateNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Gültig ab</p>
                  <p className="font-mono">{new Date(user.accessGrantedAt).toLocaleDateString('de-DE')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-swiss-red">500+</p>
              <p className="text-sm text-gray-600">Jobs</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-swiss-red">50+</p>
              <p className="text-sm text-gray-600">Vorlagen</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-swiss-red">24/7</p>
              <p className="text-sm text-gray-600">Support</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/portal"
              className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Zum Portal
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Zertifikat herunterladen (PDF)
            </button>
          </div>

          {/* Next Steps */}
          <div className="mt-10 pt-8 border-t border-gray-100 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Deine nächsten Schritte:</h3>
            <div className="space-y-3">
              {[
                'Profil im Portal vervollständigen',
                'Lebenslauf hochladen',
                'Erste Stellenangebote ansehen',
                'Community beitreten'
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-swiss-red/10 rounded-full flex items-center justify-center text-swiss-red text-sm font-semibold">
                    {i + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            📧 Eine Bestätigungs-E-Mail wurde an <strong>{user.email}</strong> gesendet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
