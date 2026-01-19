// components/agent/InstallAgentCard.tsx

import { Pressable, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppCard from "../ui/AppCard";
import useTheme from "../../hooks/useTheme";

type Props = {
  onPress: () => void;
};

export default function InstallAgentCard({ onPress }: Props) {
  const { theme } = useTheme();

  return (
    <AppCard
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <Pressable
        style={styles.content}
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
      >
        <View style={styles.iconWrap}>
          <MaterialIcons name="add" size={32} color={theme.primary} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Install Assistant
        </Text>

        <Text style={[styles.subText, { color: theme.subText }]}>
          Browse available assistants
        </Text>
      </Pressable>
    </AppCard>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",

    // Softer than agent cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,

    borderWidth: 1,
    borderStyle: "dashed",
  },

  content: {
    alignItems: "center",
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff10",
    marginBottom: 25,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  subText: {
    fontSize: 15,
    textAlign: "center",
  },
});
