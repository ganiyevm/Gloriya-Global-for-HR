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
const TOKEN_EXPIRY_MINUTES = 30;
const API_BASE_URL = 'http://localhost:5001';

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

  // Check token validity every minute
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (user && !isTokenValid(user)) {
        console.warn('Token expired, logging out');
        logout();
      }
    }, 1 * 60 * 1000);

    return () => clearInterval(checkInterval);
  }, [user]);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Login failed',
        };
      }

      const data = await response.json();
      
      // Calculate token expiry (30 minutes from now)
      const tokenExpiry = Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000;
      
      const userData: User = {
        username: data.user.username,
        name: data.user.name,
        role: data.user.role,
        token: data.token,
        tokenExpiry,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error or server unavailable',
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
        <div className="text-lg font-medium">Loading...</div>
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