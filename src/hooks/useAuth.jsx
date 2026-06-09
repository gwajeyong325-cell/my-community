import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const MOCK_USER_KEY = 'sharemood_mock_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(MOCK_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.removeItem(MOCK_USER_KEY);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.removeItem(MOCK_USER_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function mockLogin(email) {
    const mockUser = { id: 'mock', email, nickname: email.split('@')[0] };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  }

  function logout() {
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
    supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, mockLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
