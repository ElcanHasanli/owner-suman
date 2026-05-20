"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, setUnauthorizedHandler } from "@/lib/api";
import {
  clearAuth,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "@/lib/auth-storage";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const token = getToken();
    const stored = getStoredUser();
    if (!token || !stored) return null;
    try {
      const parsed = JSON.parse(stored) as AuthUser;
      if (parsed.role !== "owner") {
        clearAuth();
        return null;
      }
      return parsed;
    } catch {
      clearAuth();
      return null;
    }
  });
  const [isLoading] = useState(false);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      router.replace("/login");
    });
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      if (res.user.role !== "owner") {
        throw new Error("Bu panel yalnız platform sahibi üçündür");
      }
      setToken(res.token);
      setStoredUser(res.user);
      setUser(res.user);
      router.replace("/");
    },
    [router],
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
