import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Dashboard" }}
      />
      <Stack.Screen
        name="[agentId]"
        options={{
          title: "Agent Details",
        }}
      />
      <Stack.Screen
        name="use/[agentId]"
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
