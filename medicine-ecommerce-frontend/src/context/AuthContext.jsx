import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Strict flow: Do NOT set user state here.
    // The user must login explicitly to get the state set.
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
