import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { email: string; pass: string; firstName: string; lastName: string; phone: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (e) {
        console.error('Auth check failed', e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }

    const data = await res.json();
    setCurrentUser(data.user);
    if (data.token) {
      localStorage.setItem('kigali_token', data.token);
    }
  };

  const register = async (data: { email: string; pass: string; firstName: string; lastName: string; phone: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.pass,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }

    const resData = await res.json();
    setCurrentUser(resData.user);
    if (resData.token) {
      localStorage.setItem('kigali_token', resData.token);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    localStorage.removeItem('kigali_token');
  };

  const resetPassword = async (email: string) => {
    // Mocking for now as we don't have an email service
    console.log('Password reset requested for:', email);
    alert('If this email is registered, you will receive a reset link (Mocked).');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    const token = await getAuthToken();
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update failed');
    }

    const resData = await res.json();
    setCurrentUser(resData.user);
  };

  const getAuthToken = async () => {
    return localStorage.getItem('kigali_token');
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
