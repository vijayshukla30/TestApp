import { View } from "react-native";
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

      <View
        className="flex-1 
          px-5 pt-3 
          bg-background dark:bg-dark-background"
      >
        {children}
      </View>
    </Screen>
  );
}
