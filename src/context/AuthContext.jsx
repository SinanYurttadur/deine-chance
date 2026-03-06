import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Profil über raw fetch laden (umgeht Supabase Client Session-Lock Bug)
async function fetchProfile(userId, accessToken) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.${userId}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!res.ok) {
      console.error('Profil laden HTTP-Fehler:', res.status);
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('Profil laden fehlgeschlagen:', err.message);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Access Token speichern (von onAuthStateChange, nicht getSession)
  const accessTokenRef = useRef(null);

  // Session beim Start prüfen – NUR über onAuthStateChange (getSession hängt)
  useEffect(() => {
    // Safety-Timeout: isLoading darf nie endlos hängen
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Auth State Changes abonnieren – einzige zuverlässige Session-Quelle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Bei Passwort-Recovery sofort zur Reset-Seite weiterleiten
        if (event === 'PASSWORD_RECOVERY') {
          window.location.replace('/passwort-neu');
          return;
        }

        if (session?.user && session?.access_token) {
          accessTokenRef.current = session.access_token;
          setUser(session.user);

          const userProfile = await fetchProfile(session.user.id, session.access_token);
          setProfile(userProfile);

          if (!userProfile) {
            console.warn('Profil nicht gefunden für User:', session.user.id);
          }
        } else {
          accessTokenRef.current = null;
          setUser(null);
          setProfile(null);
        }

        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Access Token für externe Nutzung (z.B. Stripe Checkout API)
  const getAccessToken = () => accessTokenRef.current;

  // Registrierung mit Email/Passwort
  const register = async ({ email, password, firstName, lastName, phone }) => {
    setError(null);

    try {
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

      // Warten bis der DB-Trigger das Profil erstellt hat
      if (data.user && data.session) {
        accessTokenRef.current = data.session.access_token;
        let existingProfile = null;

        for (let attempt = 0; attempt < 5; attempt++) {
          await new Promise(resolve => setTimeout(resolve, 400));
          existingProfile = await fetchProfile(data.user.id, data.session.access_token);
          if (existingProfile) break;
        }

        if (!existingProfile) {
          // Fallback: Manuell erstellen falls Trigger nicht lief
          const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${data.session.access_token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              membership_status: 'pending',
              certificate_number: `DC-${new Date().getFullYear()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0, 7)}`
            }),
          });

          if (!res.ok && res.status !== 409) {
            console.error('Profil erstellen fehlgeschlagen:', res.status);
          }
        }

        setUser(data.user);
        const userProfile = await fetchProfile(data.user.id, data.session.access_token);
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

      if (data.session) {
        accessTokenRef.current = data.session.access_token;
      }

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);

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
    accessTokenRef.current = null;
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

  // Mitgliedschaft-Status neu laden
  const refreshMembership = async () => {
    if (!user || !accessTokenRef.current) {
      return { success: false, error: 'Nicht eingeloggt' };
    }

    try {
      const updatedProfile = await fetchProfile(user.id, accessTokenRef.current);
      setProfile(updatedProfile);
      return { success: true, status: updatedProfile?.membership_status };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Mitgliedschaft kündigen (über Stripe API-Endpunkt)
  const cancelMembership = async (reason) => {
    if (!user || !accessTokenRef.current) {
      return { success: false, error: 'Nicht eingeloggt' };
    }

    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Kündigung fehlgeschlagen');
      }

      // Profil neu laden
      const updatedProfile = await fetchProfile(user.id, accessTokenRef.current);
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

  // Kombiniertes User-Objekt
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
    getAccessToken,
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
