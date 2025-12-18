import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

import { AuthProvider, AuthContext } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { UIProvider } from "../context/UIContext";
import useTheme from "../hooks/useTheme";
import { createPaperTheme } from "../theme/paperTheme";

function RootNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

function PaperWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={createPaperTheme(theme)}>{children}</PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperWrapper>
          <UIProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </UIProvider>
        </PaperWrapper>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
