import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username) {
      setUser({ username, role, token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiService.login(username, password);
      
      if (response.success && response.token) {
        const userData = {
          username: response.username,
          role: response.role,
          token: response.token
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        setUser(userData);
        return { success: true };
      }

      return { success: false, message: response.message || 'Error al iniciar sesión' };
    } catch (error) {
      return { success: false, message: error.message || 'Error de conexión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
