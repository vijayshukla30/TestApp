import { Stack } from "expo-router";
import AppStackLayout from "../../../components/layouts/AppStackLayout";

export default function RecordNoteStackLayout() {
  return (
    <AppStackLayout title="">
      <Stack.Screen name="index" />
      <Stack.Screen name="new" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" />
    </AppStackLayout>
  );
}
