import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { PaperProvider } from "react-native-paper";

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import Splash from "../components/Splash";
import { createPaperTheme } from "../theme/paperTheme";
import useTheme from "../hooks/useTheme";

// 👇 IMPORTANT: prevent auto-hide immediately
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  // Hide native splash only when auth is ready
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  // Show custom splash while restoring session
  if (loading) {
    return <Splash />;
  }

  return (
    <PaperProvider theme={createPaperTheme(theme)}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
