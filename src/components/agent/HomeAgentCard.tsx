// components/agent/HomeAgentCard.tsx
import { Pressable, Image, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppCard from "../ui/AppCard";
import { getPlatformImage } from "../../utils/platform";
import useTheme from "../../hooks/useTheme";
import { Agent } from "../../types/agent";

type Props = {
  agent: Agent;
  onOpenDetail: () => void;
  onUseNow: () => void;
};

export default function HomeAgentCard({
  agent,
  onOpenDetail,
  onUseNow,
}: Props) {
  const { theme } = useTheme();

  return (
    <AppCard style={styles.card}>
      {/* Settings */}
      <Pressable style={styles.settings} onPress={onOpenDetail}>
        <MaterialIcons name="settings" size={20} color={theme.primary} />
      </Pressable>

      <Image
        source={getPlatformImage(agent.platform?.type)}
        style={styles.icon}
        resizeMode="contain"
      />

      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {agent.agentName}
      </Text>

      <Pressable style={styles.useBtn} onPress={onUseNow}>
        <MaterialIcons name="play-arrow" size={18} color="#000" />
        <Text style={styles.useText}>Use Now</Text>
      </Pressable>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: 28,
    position: "relative",
  },
  settings: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  icon: {
    width: 56,
    height: 56,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  useBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7FE9F5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  useText: {
    fontWeight: "600",
  },
});
