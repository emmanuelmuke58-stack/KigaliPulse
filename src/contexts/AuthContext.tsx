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
          return;
        }
      } catch (e) {
        console.error('Auth check failed (backend offline)', e);
      }

      // Check for static user in localStorage if backend is down
      const staticUser = localStorage.getItem('kigali_pulse_static_user');
      if (staticUser) {
        setCurrentUser(JSON.parse(staticUser));
      }
      
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        if (data.token) {
          localStorage.setItem('kigali_token', data.token);
        }
        return;
      }

      // If server returns error, handle it
      if (res.status !== 404) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
    } catch (e: any) {
      // If NOT a 404 error (server exists but something else happened), rethrow unless it's a network error
      if (e.message && !e.message.includes('404') && !e.message.includes('fetch')) {
        throw e;
      }
    }

    // --- STATIC FALLBACK (For GitHub Pages or Offline Mode) ---
    console.warn('Backend unavailable, using static fallback auth.');
    
    // Check for Admin Credentials
    if (email === 'emmanuelmuke58@gmail.com' && (pass === 'admin' || pass === 'admin123')) {
      const adminUser: UserProfile = {
        uid: 'static-admin',
        email: 'emmanuelmuke58@gmail.com',
        firstName: 'Emmanuel',
        lastName: 'Muke',
        name: 'Emmanuel Muke',
        role: 'SuperAdmin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel',
        preferredCategories: [],
        preferredNeighborhoods: [],
        savedEventIds: [],
        followedOrganizerIds: [],
        notifications: [],
      };
      setCurrentUser(adminUser);
      localStorage.setItem('kigali_pulse_static_user', JSON.stringify(adminUser));
      return;
    }

    // Check for other mock users in localStorage if they registered in static mode
    const storedUsers = JSON.parse(localStorage.getItem('kigali_pulse_mock_users') || '[]');
    const localUser = storedUsers.find((u: any) => u.email === email && u.password === pass);
    
    if (localUser) {
      const { password, ...userWithoutPassword } = localUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('kigali_pulse_static_user', JSON.stringify(userWithoutPassword));
      return;
    }

    throw new Error('Login failed: Invalid credentials or system offline.');
  };

  const register = async (data: { email: string; pass: string; firstName: string; lastName: string; phone: string }) => {
    try {
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

      if (res.ok) {
        const resData = await res.json();
        setCurrentUser(resData.user);
        if (resData.token) {
          localStorage.setItem('kigali_token', resData.token);
        }
        return;
      }

      if (res.status !== 404) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('404') && !e.message.includes('fetch')) {
        throw e;
      }
    }

    // --- STATIC REGISTER FALLBACK ---
    const newUser: any = {
      uid: `static-${Date.now()}`,
      email: data.email,
      password: data.pass,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      role: 'Standard User',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
      preferredCategories: [],
      preferredNeighborhoods: [],
      savedEventIds: [],
      followedOrganizerIds: [],
      notifications: [],
    };

    const storedUsers = JSON.parse(localStorage.getItem('kigali_pulse_mock_users') || '[]');
    if (storedUsers.some((u: any) => u.email === data.email)) {
      throw new Error('Email already registered locally.');
    }
    
    storedUsers.push(newUser);
    localStorage.setItem('kigali_pulse_mock_users', JSON.stringify(storedUsers));
    
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('kigali_pulse_static_user', JSON.stringify(userWithoutPassword));
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    
    setCurrentUser(null);
    localStorage.removeItem('kigali_token');
    localStorage.removeItem('kigali_pulse_static_user');
  };

  const resetPassword = async (email: string) => {
    // Mocking for now as we don't have an email service
    console.log('Password reset requested for:', email);
    alert('If this email is registered, you will receive a reset link (Mocked).');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const resData = await res.json();
        setCurrentUser(resData.user);
        return;
      }
    } catch (e) {}

    // --- STATIC UPDATE FALLBACK ---
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('kigali_pulse_static_user', JSON.stringify(updatedUser));
      
      // Also update in the mock users list if it exists
      const storedUsers = JSON.parse(localStorage.getItem('kigali_pulse_mock_users') || '[]');
      const index = storedUsers.findIndex((u: any) => u.email === currentUser.email);
      if (index !== -1) {
        storedUsers[index] = { ...storedUsers[index], ...data };
        localStorage.setItem('kigali_pulse_mock_users', JSON.stringify(storedUsers));
      }
    }
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
