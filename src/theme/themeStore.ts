import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNWColorScheme } from "nativewind";
import { useEffect } from "react";
import { Appearance } from "react-native";

const THEME_KEY = "preferred-theme"; // "light" | "dark" | "system"

export function useThemeController() {
  const { colorScheme, setColorScheme } = useNWColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setColorScheme(stored);
      } else {
        setColorScheme("system"); // fallback
      }
    });
  }, []);

  const toggleTheme = async () => {
    let next: "light" | "dark" | "system";

    if (colorScheme === "system") {
      next = "light";
    } else if (colorScheme === "light") {
      next = "dark";
    } else {
      next = "system";
    }

    setColorScheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  const isDark =
    colorScheme === "dark" ||
    (colorScheme === "system" && Appearance.getColorScheme() === "dark");

  return {
    colorScheme, // "light" | "dark" | "system"
    isDark,
    toggleTheme,
  };
}
