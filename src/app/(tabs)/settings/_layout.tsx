import { Stack } from "expo-router";
import useTheme from "../../../hooks/useTheme";

export default function HomeLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          color: theme.text,
          fontWeight: "600",
        },
        headerShadowVisible: false,
        animation: "slide_from_right",
        animationDuration: 220,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Settings" }}
      />
    </Stack>
  );
}
