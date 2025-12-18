import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import AuthSkeleton from "../components/auth/AuthSkeleton";

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthSkeleton />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
