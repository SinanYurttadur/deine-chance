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
    // Safety-Timeout: isLoading darf nie endlos hängen
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const initAuth = async () => {
      try {
        // Aktuelle Session holen
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const userProfile = await loadProfile(session.user.id);
          if (!userProfile) {
            console.warn('Profil konnte nicht geladen werden für User:', session.user.id, '– ggf. RLS/Netzwerk prüfen');
          }
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth init fehlgeschlagen:', err);
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };

    initAuth();

    // Auth State Changes abonnieren
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Bei Passwort-Recovery sofort zur Reset-Seite weiterleiten
        if (event === 'PASSWORD_RECOVERY') {
          window.location.replace('/passwort-neu');
          return;
        }

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

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
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
          },
          emailRedirectTo: `${window.location.origin}/login`
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
              certificate_number: `DC-${new Date().getFullYear()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0, 7)}`
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
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout fehlgeschlagen:', err);
    }
    setUser(null);
    setProfile(null);
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

  // Mitgliedschaft-Status neu laden (nach serverseitiger Aktivierung via Webhook)
  // WICHTIG: Die Aktivierung erfolgt ausschließlich serverseitig (Stripe Webhook).
  // Diese Funktion lädt nur den aktuellen Status aus der Datenbank.
  const refreshMembership = async () => {
    if (!user) return { success: false, error: 'Nicht eingeloggt' };

    try {
      const updatedProfile = await loadProfile(user.id);
      setProfile(updatedProfile);
      return { success: true, status: updatedProfile?.membership_status };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Mitgliedschaft kündigen (über sichere RPC-Funktion)
  const cancelMembership = async (reason) => {
    if (!user) return { success: false, error: 'Nicht eingeloggt' };

    try {
      const { error } = await supabase.rpc('cancel_own_membership', {
        p_reason: reason
      });

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
    refreshMembership,
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
