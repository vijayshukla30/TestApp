import { Stack } from "expo-router";
import AppStackLayout from "../../../components/layouts/AppStackLayout";

export default function RecordNoteStackLayout() {
  return (
    <AppStackLayout title="">
      <Stack.Screen name="index" />
    </AppStackLayout>
  );
}
