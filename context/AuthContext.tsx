"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api";

type UserRole = "student" | "tutor" | null;

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  subject?: string;
  hourlyRate?: number;
  rating?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string,
    subject?: string,
    hourlyRate?: number,
  ) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.getUser();
      setUser({
        id: data.id,
        name: data.first_name || data.username,
        email: data.email,
        role: data.role,
        subject: data.subject,
        hourlyRate: data.hourly_rate,
        rating: data.rating,
      });
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    localStorage.setItem("token", data.token);
    setUser({
      id: data.user.id,
      name: data.user.first_name || data.user.username,
      email: data.user.email,
      role: data.user.role,
      subject: data.user.subject,
      hourlyRate: data.user.hourly_rate,
      rating: data.user.rating,
    });
  };

  const logout = () => {
    api.logout().catch(() => {});
    localStorage.removeItem("token");
    setUser(null);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string,
    subject?: string,
    hourlyRate?: number,
  ) => {
    const data = await api.register({
      email,
      password,
      first_name: name,
      role,
      subject: subject || "",
      hourly_rate: hourlyRate || 0,
    });
    localStorage.setItem("token", data.token);
    setUser({
      id: data.user.id,
      name: data.user.first_name || data.user.username,
      email: data.user.email,
      role: data.user.role,
      subject: data.user.subject,
      hourlyRate: data.user.hourly_rate,
      rating: data.user.rating,
    });
  };

  const updateProfile = async (name: string, email: string) => {
    const data = await api.updateUser({ first_name: name, email });
    setUser({
      id: data.id,
      name: data.first_name || data.username,
      email: data.email,
      role: data.role,
      subject: data.subject,
      hourlyRate: data.hourly_rate,
      rating: data.rating,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
