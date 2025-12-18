import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, AuthContext } from "../context/AuthContext";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";

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
      {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
