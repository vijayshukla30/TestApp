import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function SettingStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: Platform.OS === "ios" ? "pageSheet" : "modal",
      }}
    />
  );
}
