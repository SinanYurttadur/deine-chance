import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  usePageTitle('Seite nicht gefunden');
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-swiss-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-swiss-red">404</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Seite nicht gefunden
          </h1>
          <p className="text-gray-600">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Zur Startseite
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
