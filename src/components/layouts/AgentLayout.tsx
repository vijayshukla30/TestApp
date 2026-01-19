// components/layouts/AgentLayout.tsx
import { View, StyleSheet } from "react-native";
import Screen from "../Screen";
import AgentHeader from "../agent/AgentHeader";
import { Agent } from "../../types/agent";

export default function AgentLayout({
  agent,
  onBack,
  children,
}: {
  agent: Agent;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <Screen>
      <AgentHeader
        title={agent.agentName}
        platform={agent.platform?.type}
        onBack={onBack}
      />

      <View style={styles.body}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
