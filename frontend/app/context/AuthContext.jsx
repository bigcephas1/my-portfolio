// app/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data.data);
    } catch (error) {
      console.error('Get user error:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = res.data.data;
      
      setUser(user);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put(`${API_URL}/auth/update-profile`, data);
      setUser(res.data.data);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(`${API_URL}/auth/update-password`, { currentPassword, newPassword });
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Password update failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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
