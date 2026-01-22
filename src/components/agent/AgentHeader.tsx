import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { getPlatformImage } from "../../utils/platform";
import ThemedIcon from "../ui/ThemedIcon";

type Props = {
  title: string;
  platform?: string;
  onBack: () => void;
};

export default function AgentHeader({ title, platform, onBack }: Props) {
  return (
    <View className="h-14 flex-row items-center px-4 bg-surface dark:bg-dark-surface border-b border-border/30 dark:border-dark-border/50">
      <Pressable onPress={onBack} hitSlop={12} className="active:opacity-70">
        <ThemedIcon name="arrow-back" size={24} />
      </Pressable>

      <View className="flex-1 flex-row items-center justify-center gap-2">
        {platform && (
          <Image
            source={getPlatformImage(platform)}
            className="w-[22px] h-[22px]"
          />
        )}
        <Text
          className="text-text dark:text-dark-text text-base font-semibold"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View className="w-6" />
    </View>
  );
}
