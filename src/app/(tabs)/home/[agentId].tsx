import React from "react";
import { Text, View } from "react-native";
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
      <Screen center>
        <View className="items-center px-6">
          <Text className="text-text dark:text-dark-text text-lg font-semibold mb-2">
            Agent details unavailable
          </Text>
          <Text className="text-subText dark:text-dark-subText text-center">
            The selected assistant could not be loaded. Please try again.
          </Text>
        </View>
      </Screen>
    );
  }

  return <AgentDetail agent={agent} />;
}
