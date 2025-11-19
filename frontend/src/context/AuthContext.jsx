import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, ...userData } = response.data.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return response.data;
  };

  const register = async (credentials) => {
    const response = await authAPI.register(credentials);
    const { token, ...userData } = response.data.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserStats = (stats) => {
    setUser((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...stats }
    }));
  };

  const updateUserSettings = (settings) => {
    setUser((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserStats, updateUserSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
