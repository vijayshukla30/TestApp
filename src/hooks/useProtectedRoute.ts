import { useEffect } from "react";
import { useSegments, router } from "expo-router";
import { useSelector } from "react-redux";

export default function useProtectedRoute() {
  const segments = useSegments();
  const { user, loading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (loading) return;

    const root = segments[0];

    if (!user && root === "(tabs)") {
      router.replace("/(auth)/login");
      return;
    }

    if (user && root === "(auth)") {
      router.replace("/(tabs)/home");
    }
  }, [segments, user, loading]);
}
