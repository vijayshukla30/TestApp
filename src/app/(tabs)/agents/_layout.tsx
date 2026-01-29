import { Stack } from "expo-router";
import { colors } from "../../../theme/colors";

export default function AgentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
