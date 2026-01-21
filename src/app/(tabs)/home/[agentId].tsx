import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Screen from "../../../components/Screen";
import { Agent } from "../../../types/agent";
import AgentDetail from "../../../components/agent/AgentDetail";

export default function AgentDetails() {
  const params = useLocalSearchParams();

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;

  if (!agent) {
    return (
      <Screen>
        <Text className="text-text">Agent details unavailable</Text>
      </Screen>
    );
  }

  return <AgentDetail agent={agent} />;
}
