import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, login as apiLogin, signup as apiSignup, refreshAccessToken, logoutRequest } from './services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('lb_token'));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const init = async () => {
      if (!token) return setLoading(false);
      try {
        const data = await fetchMe(token);
        setUser(data.user);
      } catch (err) {
        // try refresh flow once
        try {
          const ref = await refreshAccessToken();
          if (ref?.token) {
            localStorage.setItem('lb_token', ref.token);
            setToken(ref.token);
            const data2 = await fetchMe(ref.token);
            setUser(data2.user);
            return;
          }
        } catch (err2) {
          // ignore
        }

        console.warn('Invalid token, clearing', err);
        localStorage.removeItem('lb_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const login = async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    if (data.token) {
      localStorage.setItem('lb_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const signup = async ({ email, password, name, role }) => {
    const data = await apiSignup({ email, password, name, role });
    if (data.token) {
      localStorage.setItem('lb_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    try {
      logoutRequest();
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('lb_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
