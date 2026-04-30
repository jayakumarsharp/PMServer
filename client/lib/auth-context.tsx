"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, User } from "./api";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null, token: null, loading: true,
  login: async () => {}, logout: () => {}, refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser(tok: string, username: string) {
    try {
      const { user: u } = await auth.getUser(username);
      setUser(u);
    } catch {
      logout();
    }
  }

  useEffect(() => {
    const tok = localStorage.getItem("pms_token");
    const uname = localStorage.getItem("pms_username");
    if (tok && uname) {
      setToken(tok);
      loadUser(tok, uname).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(username: string, password: string) {
    const { token: tok } = await auth.login(username, password);
    localStorage.setItem("pms_token", tok);
    localStorage.setItem("pms_username", username);
    setToken(tok);
    const { user: u } = await auth.getUser(username);
    setUser(u);
  }

  function logout() {
    localStorage.removeItem("pms_token");
    localStorage.removeItem("pms_username");
    setToken(null);
    setUser(null);
  }

  async function refresh() {
    const uname = localStorage.getItem("pms_username");
    if (uname) {
      const { user: u } = await auth.getUser(uname);
      setUser(u);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
