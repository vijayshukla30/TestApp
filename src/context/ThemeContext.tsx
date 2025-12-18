import React, { createContext, useEffect, useState } from "react";
import light from "../theme/light";
import dark from "../theme/dark";
import { saveTheme, getTheme } from "../utils/storage";
import { Theme } from "../theme/types";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(dark);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreTheme() {
      const stored = await getTheme();
      setTheme(stored === "light" ? light : dark);
      setLoading(false);
    }
    restoreTheme();
  }, []);

  const toggleTheme = async () => {
    const next = theme.mode === "light" ? dark : light;
    setTheme(next);
    await saveTheme(next.mode); // ✅ ThemeMode now
  };

  if (loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
