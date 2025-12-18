import * as SecureStore from "expo-secure-store";

const THEME_KEY = "APP_THEME";

export type ThemeMode = "light" | "dark";

export async function saveTheme(mode: ThemeMode) {
  await SecureStore.setItemAsync(THEME_KEY, mode);
}

export async function getTheme(): Promise<ThemeMode | null> {
  const value = await SecureStore.getItemAsync(THEME_KEY);
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}
