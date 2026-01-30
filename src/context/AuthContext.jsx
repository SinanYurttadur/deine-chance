import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lade Benutzerprofil aus der Datenbank
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profil laden fehlgeschlagen:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profil laden fehlgeschlagen:', err);
      return null;
    }
  };

  // Session beim Start prüfen
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Aktuelle Session holen
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const userProfile = await loadProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth init fehlgeschlagen:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Auth State Changes abonnieren
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const userProfile = await loadProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Registrierung mit Email/Passwort
  const register = async ({ email, password, firstName, lastName, phone }) => {
    setError(null);

    try {
      // 1. Supabase Auth User erstellen (Trigger erstellt Profil automatisch)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone
          }
        }
      });

      if (signUpError) throw signUpError;

      // 2. Warten bis der DB-Trigger das Profil erstellt hat (Retry-Polling)
      if (data.user) {
        let existingProfile = null;
        for (let attempt = 0; attempt < 5; attempt++) {
          await new Promise(resolve => setTimeout(resolve, 400));
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            existingProfile = profile;
            break;
          }
        }

        if (!existingProfile) {
          // Fallback: Manuell erstellen falls Trigger nicht lief
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              membership_status: 'pending',
              certificate_number: `DC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
            });

          if (profileError && profileError.code !== '23505') {
            console.error('Profil erstellen fehlgeschlagen:', profileError);
          }
        }

        // User und Profil setzen
        setUser(data.user);
        const userProfile = await loadProfile(data.user.id);
        setProfile(userProfile);
      }

      return { success: true, user: data.user, needsEmailConfirmation: !data.session };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login mit Email/Passwort
  const login = async (email, password) => {
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);

      // Deutsche Fehlermeldungen
      let errorMessage = err.message;
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = 'Ungültige E-Mail oder Passwort';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = 'Bitte bestätige zuerst deine E-Mail-Adresse';
      }

      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout fehlgeschlagen:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Passwort zurücksetzen (Email senden)
  const resetPassword = async (email) => {
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/passwort-neu`
      });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Neues Passwort setzen (nach Reset-Link)
  const updatePassword = async (newPassword) => {
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Mitgliedschaft aktivieren (nach Zahlung)
  // WICHTIG: In Produktion sollte die Aktivierung ausschließlich
  // serverseitig (Stripe Webhook / Edge Function) erfolgen.
  // Diese Client-Funktion ist nur für den Demo-Modus gedacht.
  const activateMembership = async (paymentData) => {
    if (!user) return { success: false, error: 'Nicht eingeloggt' };

    if (!paymentData?.sessionId && !paymentData?.demo) {
      return { success: false, error: 'Keine gültige Zahlungsreferenz' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          membership_status: 'active',
          paid_at: new Date().toISOString(),
          paid_amount: paymentData.amount || 249,
          access_granted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedProfile = await loadProfile(user.id);
      setProfile(updatedProfile);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Mitgliedschaft kündigen
  const cancelMembership = async (reason) => {
    if (!user) return { success: false, error: 'Nicht eingeloggt' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          membership_status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason
        })
        .eq('id', user.id);

      if (error) throw error;

      // Profil neu laden
      const updatedProfile = await loadProfile(user.id);
      setProfile(updatedProfile);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Hilfsfunktionen
  const hasActiveMembership = () => {
    return profile?.membership_status === 'active';
  };

  // Pending Registration für Checkout (aus localStorage, Fallback)
  const getPendingRegistration = () => {
    try {
      const pending = localStorage.getItem('deinechance_pending_user');
      return pending ? JSON.parse(pending) : null;
    } catch {
      localStorage.removeItem('deinechance_pending_user');
      return null;
    }
  };

  const savePendingRegistration = (data) => {
    localStorage.setItem('deinechance_pending_user', JSON.stringify(data));
  };

  const clearPendingRegistration = () => {
    localStorage.removeItem('deinechance_pending_user');
  };

  // Kombiniertes User-Objekt (für Abwärtskompatibilität)
  const combinedUser = user ? {
    id: user.id,
    email: user.email,
    firstName: profile?.first_name || user.user_metadata?.first_name,
    lastName: profile?.last_name || user.user_metadata?.last_name,
    phone: profile?.phone || user.user_metadata?.phone,
    membershipStatus: profile?.membership_status || 'pending',
    certificateNumber: profile?.certificate_number,
    accessGrantedAt: profile?.access_granted_at,
    ...profile
  } : null;

  const value = {
    user: combinedUser,
    rawUser: user,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    hasActiveMembership,
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    activateMembership,
    cancelMembership,
    getPendingRegistration,
    savePendingRegistration,
    clearPendingRegistration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
