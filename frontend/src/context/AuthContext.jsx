import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getToken } from '../api/client';
import { getMe, loginUser, registerUser } from '../api/authApi';
import { useCulture } from './CultureContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { setCultureCode } = useCulture();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    const loadUser = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getMe();
        setUser(profile);
        if (profile.preferred_culture) {
          await setCultureCode(profile.preferred_culture, { persistRemote: false });
        }
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener('masrofy:unauthorized', onUnauthorized);
    return () => window.removeEventListener('masrofy:unauthorized', onUnauthorized);
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);
    setUser(data.user);
    if (data.user.preferred_culture) {
      await setCultureCode(data.user.preferred_culture, { persistRemote: false });
    }
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    setUser(data.user);
    if (data.user.preferred_culture) {
      await setCultureCode(data.user.preferred_culture, { persistRemote: false });
    }
    return data.user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
