import React from "react";
import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function LoadingCard({ title = "Loading", subtitle }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <View className="flex-1 items-center justify-center">
      <BlurView
        intensity={25}
        tint={isDark ? "dark" : "light"}
        className="rounded-2xl px-7 py-6 items-center"
        style={{
          backgroundColor: isDark ? "rgba(15,20,35,0.8)" : colors.surface,
          minWidth: 220,
        }}
      >
        <MaterialIcons name="hourglass-top" size={28} color={colors.primary} />

        <Text className="text-text text-base font-semibold mt-2">{title}</Text>

        {subtitle && (
          <Text className="text-subText text-xs text-center mt-1">
            {subtitle}
          </Text>
        )}

        <ActivityIndicator
          size="small"
          color={colors.primary}
          className="mt-3"
        />
      </BlurView>
    </View>
  );
}
