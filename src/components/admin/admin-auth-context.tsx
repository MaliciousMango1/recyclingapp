"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { setAdminToken } from "~/components/providers";

interface AdminAuthContext {
  token: string | null;
  isAuthenticated: boolean;
  login: (password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AdminAuthContext>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback((password: string) => {
    setToken(password);
    setAdminToken(password);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdminToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AuthContext);
}
