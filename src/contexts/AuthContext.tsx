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

const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
  { username: 'accountant', password: 'acc123', name: 'Accountant User', role: 'accountant' },
  { username: 'manager', password: 'mgr123', name: 'Manager User', role: 'manager' },
];

const STORAGE_KEY = 'gloriya_auth';
const TOKEN_EXPIRY_MINUTES = 30; // Token 30 minutdan keyin muddati tugaydi

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

  // Har 5 minutda token validity tekshir
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (user && !isTokenValid(user)) {
        console.warn('Token muddati tugadi, logout qilindi');
        logout();
      }
    }, 1 * 60 * 1000); // 5 minut

    return () => clearInterval(checkInterval);
  }, [user]);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    // Simulate API call delay with mock authentication
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check against demo users (no API call)
    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) {
      return {
        success: false,
        error: 'Noto\'g\'ri foydalanuvchi nomi yoki parol',
      };
    }

    // Generate mock token with expiry
    const token = `demo_token_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`;
    const tokenExpiry = Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000; // 30 minut keyin
    
    const userData: User = {
      username: found.username,
      name: found.name,
      role: found.role,
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