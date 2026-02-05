import { Stack } from "expo-router";
import AppStackLayout from "../../../components/layouts/AppStackLayout";

export default function RecordNoteStackLayout() {
  return (
    <AppStackLayout title="">
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
    </AppStackLayout>
  );
}
