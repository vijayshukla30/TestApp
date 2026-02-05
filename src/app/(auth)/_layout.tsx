import { Stack } from "expo-router";
import useProtectedRoute from "../../hooks/useProtectedRoute";

export default function AuthLayout() {
  useProtectedRoute();

  return <Stack screenOptions={{ headerShown: false }} />;
}
