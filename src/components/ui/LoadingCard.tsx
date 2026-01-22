import React from "react";
import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import { BlurView } from "expo-blur";
import ThemedIcon from "./ThemedIcon";

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
        className="
      rounded-2xl px-7 py-6 items-center
      bg-surface/80 dark:bg-dark-surface/70
      border border-border/30 dark:border-dark-border/40
      shadow-lg dark:shadow-xl
      backdrop-blur-md
    "
      >
        <ThemedIcon name="hourglass-top" size={28} />

        <Text className="text-text dark:text-dark-text text-base font-semibold mt-2">
          {title}
        </Text>

        {subtitle && (
          <Text className="text-subText dark:text-dark-subText text-xs text-center mt-1 max-w-[90%]">
            {subtitle}
          </Text>
        )}

        <ActivityIndicator
          size="small"
          color={isDark ? "#8B9CFF" : "#6366F1"}
          className="mt-3"
        />
      </BlurView>
    </View>
  );
}
