import { View, Text, Pressable, Switch } from "react-native";
import { router } from "expo-router";
import Screen from "../../../components/Screen";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import { useAppTheme } from "../../../context/ThemeProvider";

export default function Settings() {
  const { user, logout } = useAuth()!;
  const { isDark, toggleTheme } = useAppTheme();

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <Text className="text-text dark:text-dark-text text-xl font-semibold mb-4">
        Settings
      </Text>
      {/* Section title */}
      <Text className="text-subText dark:text-dark-subText text-xs uppercase tracking-wider mb-2">
        Account
      </Text>

      <Card className="p-3">
        <Text className="text-subText dark:text-dark-subText text-xs">
          Signed in as
        </Text>
        <Text className="text-text dark:text-dark-text text-base font-semibold mt-1">
          {user?.email}
        </Text>
      </Card>

      <Text className="text-subText dark:text-dark-subText text-xs uppercase tracking-wider mt-7 mb-2">
        Preferences
      </Text>

      <Card className="p-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-text dark:text-dark-text text-base">
            Dark theme
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: "rgba(100,100,100,0.4)",
              true: "#8B9CFF",
            }}
            thumbColor={isDark ? "#FFFFFF" : "#F3F4F6"}
            ios_backgroundColor="rgba(100,100,100,0.4)"
          />
        </View>
      </Card>

      <Text className="text-subText dark:text-dark-subText text-xs uppercase tracking-wider mt-7 mb-2">
        Danger Zone
      </Text>

      <Card>
        <Pressable
          onPress={onLogout}
          className="bg-red-500 dark:bg-red-600 rounded-xl py-3 items-center active:opacity-80"
        >
          <Text className="text-white dark:text-white font-semibold text-base">
            Sign out
          </Text>
        </Pressable>
      </Card>
    </Screen>
  );
}
