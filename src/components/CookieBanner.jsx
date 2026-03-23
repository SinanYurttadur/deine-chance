import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'deinechance_cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="w-6 h-6 text-yellow-400 flex-shrink-0 hidden sm:block" />
        <div className="flex-1 text-sm">
          <p>
            Diese Website verwendet ausschließlich technisch notwendige Cookies für die Authentifizierung und Funktionalität.
            Wir setzen <strong>keine</strong> Analyse- oder Marketing-Cookies ein.{' '}
            <Link to="/legal#datenschutz" className="text-swiss-red hover:underline">
              Mehr erfahren
            </Link>
          </p>
        </div>
        <button
          onClick={accept}
          className="bg-swiss-red hover:bg-swiss-red-dark text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
