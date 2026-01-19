import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function LoadingCard({ title = "Loading", subtitle }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <BlurView
        intensity={25}
        tint={theme.mode === "dark" ? "dark" : "light"}
        style={[
          styles.card,
          {
            backgroundColor:
              theme.mode === "dark" ? "rgba(15,20,35,0.8)" : theme.surface,
          },
        ]}
      >
        <MaterialIcons name="hourglass-top" size={28} color={theme.primary} />

        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            {subtitle}
          </Text>
        )}

        <ActivityIndicator
          size="small"
          color={theme.primary}
          style={{ marginTop: 12 }}
        />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    minWidth: 220,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
  },

  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
  },
});
