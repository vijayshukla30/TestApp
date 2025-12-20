import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { getSession, saveSession, clearSession } from "../services/session";
import { User, JwtPayload } from "../types/auth";

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await getSession();

        if (session?.token) {
          const decoded = jwtDecode<JwtPayload>(session.token);

          setUser({
            ...session.user,
            uuid: decoded.uuid,
            email: decoded.email,
            role: decoded.role,
          });
          setToken(session.token);
        }
      } catch (error) {
        console.log("AuthContext restore error:", error);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (token: string, user: User) => {
    const decoded = jwtDecode<JwtPayload>(token);

    const enrichedUser: User = {
      ...user,
      uuid: decoded.uuid,
      email: decoded.email,
      role: decoded.role,
    };

    await saveSession(token, enrichedUser);
    setToken(token);
    setUser(enrichedUser);
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
