import {
  View,
  Text,
  Pressable,
  Switch,
  PanResponder,
  Animated,
} from "react-native";
import { useRef } from "react";
import { router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Screen from "../../../components/Screen";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import { colors } from "../../../theme/colors";
import { useThemeController } from "../../../theme/themeStore";

export default function Settings() {
  useFocusEffect(() => {
    translateY.setValue(0);
  });
  const { isDark, toggleTheme } = useThemeController();
  const { user, logout } = useAuth()!;

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 🔥 important
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dy > 8 && Math.abs(gesture.dx) < 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          router.back(); // dismiss
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Screen withHeader modal>
      <Animated.View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 12,
          transform: [{ translateY }],
        }}
      >
        {/* 🔥 DRAGGABLE HEADER ONLY */}
        <View
          {...panResponder.panHandlers} // 🔥 attach here
          className="items-center mb-4"
        >
          <View className="w-12 h-1 bg-border rounded-full mb-3" />

          <View className="w-full flex-row items-center justify-between">
            <View className="w-8" />
            <Text className="text-text text-lg font-semibold">Settings</Text>
            <Pressable onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* CONTENT (non-draggable) */}
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
      </Animated.View>
    </Screen>
  );
}
