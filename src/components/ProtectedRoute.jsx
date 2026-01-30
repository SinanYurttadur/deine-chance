import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-8 h-8 text-swiss-red animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Wird geladen...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requireMembership = false }) => {
  const { isAuthenticated, isLoading, hasActiveMembership } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireMembership && !hasActiveMembership()) {
    return <Navigate to="/checkout" replace />;
  }

  return children;
};

export default ProtectedRoute;
