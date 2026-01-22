import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { colors } from "../../theme/colors";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0B1020" : "#F8FAFC",
          borderTopColor: isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB",
          elevation: 10,
        },
        tabBarActiveTintColor: isDark ? "#8B9CFF" : "#6366F1",
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#6B7280",
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
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
