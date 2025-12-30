import React, { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import light from "../theme/light";
import dark from "../theme/dark";
import { saveTheme, getTheme } from "../utils/storage";
import { Theme, ThemeMode } from "../types/theme";

type ThemeContextType = {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemMode = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(
    systemMode === "light" ? light : dark
  );
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
    await saveTheme(next.mode);
  };

  if (loading) return null;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode: theme.mode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
