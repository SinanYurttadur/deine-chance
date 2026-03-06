import { useState, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-8 h-8 text-swiss-red animate-spin mx-auto mb-4" />
      <p className="text-gray-600">{message || 'Wird geladen...'}</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requireMembership = false }) => {
  const { isAuthenticated, isLoading, hasActiveMembership, refreshMembership } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isPolling, setIsPolling] = useState(false);
  const [pollDone, setPollDone] = useState(false);

  // Nach Stripe-Redirect: Profil pollen bis membership_status = active
  const hasSessionId = searchParams.has('session_id');

  useEffect(() => {
    if (!requireMembership || !hasSessionId || isLoading || !isAuthenticated || hasActiveMembership()) {
      return;
    }

    let cancelled = false;
    setIsPolling(true);

    const poll = async () => {
      for (let i = 0; i < 15; i++) {
        if (cancelled) return;
        const result = await refreshMembership();
        if (result?.status === 'active') {
          setIsPolling(false);
          setPollDone(true);
          return;
        }
        await new Promise(r => setTimeout(r, 2000));
      }
      // Timeout nach 30 Sekunden
      if (!cancelled) {
        setIsPolling(false);
        setPollDone(true);
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [requireMembership, hasSessionId, isLoading, isAuthenticated]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireMembership && !hasActiveMembership()) {
    // Warten auf Webhook nach Stripe-Zahlung
    if (hasSessionId && (isPolling || !pollDone)) {
      return <LoadingScreen message="Zahlung wird bestätigt..." />;
    }
    return <Navigate to="/checkout" replace />;
  }

  return children;
};

export default ProtectedRoute;
