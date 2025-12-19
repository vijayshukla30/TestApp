import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Screen from "../../../components/Screen";
import useTheme from "../../../hooks/useTheme";
import { Agent } from "../../../types/agent";
import AppCard from "../../../components/ui/AppCard";
import { getPlatformImage } from "../../../utils/platformImage";

export default function AgentDetails() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;

  if (!agent) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Agent not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppCard style={styles.card}>
        <Image
          source={getPlatformImage(agent.platform?.type)}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={[styles.name, { color: theme.text }]}>
          {agent.agentName}
        </Text>

        {agent.platform?.name && (
          <Text style={[styles.platform, { color: theme.subText }]}>
            Platform: {agent.platform.name}
          </Text>
        )}

        <Text style={[styles.meta, { color: theme.subText }]}>
          Visibility: {agent.isPublic ? "Public" : "Private"}
        </Text>

        <Text style={[styles.meta, { color: theme.subText }]}>
          Agent ID: {agent.uuid}
        </Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: 28,
  },
  image: {
    width: 56,
    height: 56,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  platform: {
    marginTop: 8,
    fontSize: 14,
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
  },
});
