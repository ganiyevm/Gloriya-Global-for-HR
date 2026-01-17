
import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  username: string;
  name: string;
  role: string;
  token: string;
  tokenExpiry?: number; // milliseconds timestamp
} | null;

export type LoginResult = { success: true } | { success: false; error: string };

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'gloriya_auth';
const TOKEN_EXPIRY_MINUTES = 30; // Token 30 minutdan keyin muddati tugaydi

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token validity check
  const isTokenValid = (userData: User): boolean => {
    if (!userData || !userData.tokenExpiry) return false;
    return Date.now() < userData.tokenExpiry;
  };

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const userData = JSON.parse(raw);
        if (isTokenValid(userData)) {
          setUser(userData);
        } else {
          // Token muddati tugagan - o'chir
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        }
      }
    } catch (e) {
      console.error('Failed to load auth from storage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Har 1 minutda token validity tekshir
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (user && !isTokenValid(user)) {
        console.warn('Token muddati tugadi, logout qilindi');
        logout();
      }
    }, 1 * 60 * 1000); // 1 minut
    return () => clearInterval(checkInterval);
  }, [user]);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: false,
          error: data?.error || 'Login muvaffaqiyatsiz',
        };
      }
      const data = await res.json();
      // data: { token, user: { username, name, role } }
      const token = data.token;
      const tokenExpiry = Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000;
      const userData: User = {
        username: data.user.username,
        name: data.user.name,
        role: data.user.role,
        token,
        tokenExpiry,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } catch (e) {
        console.error('Failed to save auth to storage:', e);
      }
      setUser(userData);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: 'Tarmoq xatosi yoki server ishlamayapti',
      };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg font-medium">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};