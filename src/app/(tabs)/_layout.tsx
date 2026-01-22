import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import ThemedIcon from "../../components/ui/ThemedIcon";

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
            <ThemedIcon name="home" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="agents"
        options={{
          title: "Assistants",
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="group" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <ThemedIcon name="settings" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
