import { Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { PaperProvider } from "react-native-paper";

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";
import { createPaperTheme } from "../theme/paperTheme";

// Prevent auto hide ONCE
SplashScreen.preventAutoHideAsync();

function Providers() {
  const { theme } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={createPaperTheme(theme)}>
      <Slot />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Providers />
      </AuthProvider>
    </ThemeProvider>
  );
}
