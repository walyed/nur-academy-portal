"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'student' | 'tutor' | null;

interface User {
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  signup: (name: string, role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser({
      name: role === 'student' ? 'Alice Cooper' : 'John Smith',
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const signup = (name: string, role: UserRole) => {
    setUser({ name, role });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
