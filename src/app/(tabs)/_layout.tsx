import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import useProtectedRoute from "../../hooks/useProtectedRoute";

export default function TabsLayout() {
  useProtectedRoute();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          elevation: 10,
          shadowColor: "#000", // iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subText,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="agents"
        options={{
          title: "Assistants",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="group" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="record-note"
        options={{
          title: "Record Note",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="record-voice-over" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // 🔥 hides it from bottom tabs
        }}
      />
    </Tabs>
  );
}
