import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register function
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/signup', { name, email, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // ✅ Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
