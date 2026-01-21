import { Stack } from "expo-router";
import useTheme from "../../../hooks/useTheme";
import { colors } from "../../../theme/colors";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "600",
          fontSize: 16,
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
