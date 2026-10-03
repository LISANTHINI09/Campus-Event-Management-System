import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentService } from '../services/studentService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campus_event_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('campus_event_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('campus_event_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await studentService.login({ email, password });
      const user = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        department: response.department,
        year: response.year,
        phoneNumber: response.phoneNumber,
      };
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campus_event_user');
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('campus_event_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isStudent: currentUser?.role === 'STUDENT',
    isAdmin: currentUser?.role === 'ADMIN',
    login,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
