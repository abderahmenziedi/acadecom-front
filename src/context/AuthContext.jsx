import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authApi from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        const decoded = jwtDecode(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const timeout = decoded.exp * 1000 - Date.now();
      if (timeout <= 0) {
        handleLogout();
        return;
      }
      const timer = setTimeout(() => {
        toast.error('Session expirée, veuillez vous reconnecter');
        handleLogout();
      }, timeout);
      return () => clearTimeout(timer);
    } catch {
      handleLogout();
    }
  }, [token]);

  const handleLogin = async (credentials) => {
    const response = await authApi.login(credentials);
    const { token: jwt, user: userData } = response.data.data;
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    toast.success('Connexion réussie !');
    return userData;
  };

  const handleRegister = async (formData) => {
    const response = await authApi.register(formData);
    toast.success('Inscription réussie ! Connectez-vous.');
    return response.data;
  };

  const handleLogout = () => {
    authApi.logout().catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login: handleLogin, register: handleRegister, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
