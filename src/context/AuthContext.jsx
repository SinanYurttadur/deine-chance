import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('deinechance_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Register new user (Step 1 of signup)
  const register = (userData) => {
    const newUser = {
      id: `DC-${Date.now()}`,
      ...userData,
      membershipStatus: 'pending', // pending, active, expired
      registeredAt: new Date().toISOString(),
      certificateNumber: `DC-2024-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };

    // Store temporarily until payment
    localStorage.setItem('deinechance_pending_user', JSON.stringify(newUser));
    return newUser;
  };

  // Complete payment and activate membership
  const completePurchase = (paymentData) => {
    const pendingUser = JSON.parse(localStorage.getItem('deinechance_pending_user'));

    if (!pendingUser) {
      throw new Error('No pending registration found');
    }

    const activatedUser = {
      ...pendingUser,
      membershipStatus: 'active',
      paymentMethod: paymentData.method,
      paidAt: new Date().toISOString(),
      paidAmount: 249,
      accessGrantedAt: new Date().toISOString()
    };

    // Save as active user
    localStorage.setItem('deinechance_user', JSON.stringify(activatedUser));
    localStorage.removeItem('deinechance_pending_user');
    setUser(activatedUser);

    return activatedUser;
  };

  // Login existing user
  const login = (email, password) => {
    // In real app, this would be an API call
    const storedUser = localStorage.getItem('deinechance_user');

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.email === email) {
        // Mock password check (in real app, this is server-side)
        if (password === userData.password || password === 'demo123') {
          setUser(userData);
          return { success: true, user: userData };
        }
      }
    }

    return { success: false, error: 'Ungültige E-Mail oder Passwort' };
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('deinechance_user');
    setUser(null);
  };

  // Check if user has active membership
  const hasActiveMembership = () => {
    return user?.membershipStatus === 'active';
  };

  // Get pending registration data
  const getPendingRegistration = () => {
    const pending = localStorage.getItem('deinechance_pending_user');
    return pending ? JSON.parse(pending) : null;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasActiveMembership,
    register,
    completePurchase,
    login,
    logout,
    getPendingRegistration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
