import { View, Text, Pressable, Switch } from "react-native";
import { router } from "expo-router";
import Screen from "../../../components/Screen";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import { colors } from "../../../theme/colors";
import { useThemeController } from "../../../theme/themeStore";

export default function Settings() {
  const { isDark, toggleTheme } = useThemeController();
  const { user, logout } = useAuth()!;

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <Text className="text-text text-xl font-semibold mb-4">Settings</Text>
      {/* Section title */}
      <Text className="text-subText text-xs uppercase tracking-wider mb-2">
        Account
      </Text>

      <Card className="p-3">
        <Text className="text-subText text-xs">Signed in as</Text>
        <Text className="text-text text-base font-semibold mt-1">
          {user?.email}
        </Text>
      </Card>

      <Text className="text-subText text-xs uppercase tracking-wider mt-7 mb-2">
        Preferences
      </Text>

      <Card className="p-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-text text-base">Dark theme</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: "rgba(255,255,255,0.2)",
              true: colors.primary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <Text className="text-subText text-xs uppercase tracking-wider mt-7 mb-2">
        Danger Zone
      </Text>

      <Card>
        <Pressable
          onPress={onLogout}
          className="bg-red-500 rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold text-base">Sign out</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}
