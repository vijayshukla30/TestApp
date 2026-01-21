import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNWColorScheme } from "nativewind";
import { useEffect } from "react";

const THEME_KEY = "app-theme"; // "light" | "dark"

export function useThemeController() {
  const { colorScheme, setColorScheme } = useNWColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "light" || stored === "dark") {
        setColorScheme(stored);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  return {
    isDark: colorScheme === "dark",
    toggleTheme,
  };
}
