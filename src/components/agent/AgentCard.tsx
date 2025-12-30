import { Pressable, Image, Text, StyleSheet } from "react-native";
import AppCard from "../ui/AppCard";
import { getPlatformImage } from "../../utils/platform";
import useTheme from "../../hooks/useTheme";
import { Agent } from "../../types/agent";

type Props = {
  agent: Agent;
  onOpenDetail: () => void;
};

export default function AgentCard({ agent, onOpenDetail }: Props) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onOpenDetail}>
      <AppCard style={styles.card}>
        <Image
          source={getPlatformImage(agent.platform?.type)}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {agent.agentName}
        </Text>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: 28,
  },
  icon: {
    width: 56,
    height: 56,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
