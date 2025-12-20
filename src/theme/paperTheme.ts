import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { Theme } from "../types/theme";

export function createPaperTheme(appTheme: Theme) {
  const base = appTheme.mode === "dark" ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: appTheme.primary,
      background: appTheme.background,
      surface: appTheme.surface,
      outline: appTheme.border,
      onSurface: appTheme.text,
      onBackground: appTheme.text,
    },
  };
}
