import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getPlatformImage } from "../../utils/platform";
import { colors } from "../../theme/colors";

type Props = {
  title: string;
  platform?: string;
  onBack: () => void;
};

export default function AgentHeader({ title, platform, onBack }: Props) {
  return (
    <View className="h-14 flex-row items-center px-4">
      <Pressable onPress={onBack} hitSlop={12}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <View className="flex-1 flex-row items-center justify-center gap-2">
        {platform && (
          <Image
            source={getPlatformImage(platform)}
            className="w-[22px] h-[22px]"
          />
        )}
        <Text className="text-text text-base font-semibold" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View className="w-6" />
    </View>
  );
}
