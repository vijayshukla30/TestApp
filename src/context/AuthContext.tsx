import React, { createContext, useEffect, useState } from "react";
import { getSession, saveSession, clearSession } from "../services/session";
import { User } from "../types/auth";

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean; // ✅ ADD THIS
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: restoreSession start");

    async function restoreSession() {
      try {
        const session = await getSession();
        console.log("AuthContext: session =", session);

        if (session) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (error) {
        console.log("AuthContext error:", error);
      } finally {
        console.log("AuthContext: setLoading(false)");
        setLoading(false); // ⛔ MUST RUN
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    console.log("Auth loading:", loading);
  }, [loading]);

  const login = async (token: string, user: User) => {
    await saveSession(token, user);
    setToken(token);
    setUser(user);
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
        loading, // ✅ PROVIDED
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
