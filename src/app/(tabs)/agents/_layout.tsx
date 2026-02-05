import { Stack } from "expo-router";
import AppStackLayout from "../../../components/layouts/AppStackLayout";

export default function AgentsLayout() {
  return (
    <AppStackLayout title="">
      <Stack.Screen name="index" />
      <Stack.Screen name="[agentId]" />
    </AppStackLayout>
  );
}
