import React, { Children, createContext, useEffect, useState } from "react";
import { getSession, saveSession, clearSession } from "../services/session";

type AuthContextType = {
  user: null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const session = await getSession();

      if (session) {
        setUser(session.user);
        setToken(session.token);
      }

      setLoading(false);
    }

    restoreSession();
  }, []);

  const login = async (token: string, user: any) => {
    await saveSession(token, user);
    setToken(token);
    setUser(user);
  };

  const logout = async () => {
    await clearSession();
    setToken(null);
    setUser(null);
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
};
