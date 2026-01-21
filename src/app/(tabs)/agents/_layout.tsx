import { Stack } from "expo-router";
import { colors } from "../../../theme/colors";

export default function AgentsLayout() {
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
        },
        headerShadowVisible: false,
        animation: "slide_from_right",
        animationDuration: 220,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Agents",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[agentId]"
        options={{
          title: "Agent Details",
        }}
      />
    </Stack>
  );
}
