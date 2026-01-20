import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import { getPlatformImage } from "../../utils/platform";

type Props = {
  title: string;
  platform?: string;
  onBack: () => void;
};

export default function AgentHeader({ title, platform, onBack }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={12}>
        <MaterialIcons name="arrow-back" size={24} color={theme.text} />
      </Pressable>

      <View style={styles.center}>
        {platform && (
          <Image source={getPlatformImage(platform)} style={styles.icon} />
        )}
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* spacer to balance back icon */}
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    width: 22,
    height: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
