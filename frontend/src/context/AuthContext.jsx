import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, initCsrf } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initCsrf();
      try {
        const res = await authAPI.me();
        setUser(res.data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (username, password) => {
    await initCsrf();
    const res = await authAPI.login(username, password);
    setUser(res.data);
    return res.data;
  };

  const signup = async (data) => {
    await initCsrf();
    const res = await authAPI.signup(data);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
