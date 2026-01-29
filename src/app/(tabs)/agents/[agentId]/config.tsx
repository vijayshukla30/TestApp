import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, router } from "expo-router";
import useAuth from "../../../../hooks/useAuth";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { Agent } from "../../../../types/agent";
import { useConsumerDetails } from "../../../../hooks/useConsumerDetails";
import Screen from "../../../../components/Screen";
import LoadingCard from "../../../../components/ui/LoadingCard";

export default function AgentConfigScreen() {
  const { agentId } = useLocalSearchParams<{ agentId: string }>();
  const agent = useAppSelector(
    (s) => s.agents.list.find((a) => a.uuid === agentId) as Agent | undefined,
  );

  const { consumer, loading, isInstalled } = useConsumerDetails(agent ?? null);

  if (!agent) {
    return (
      <Screen>
        <Text className="text-center mt-10">Agent not found</Text>
      </Screen>
    );
  }

  // ⏳ Loading consumer
  if (loading || !consumer) {
    return (
      <Screen>
        <LoadingCard
          title="Loading configuration"
          subtitle="Preparing setup options"
        />
      </Screen>
    );
  }

  if (isInstalled) {
    router.replace({
      pathname: "/agents/[agentId]",
      params: { agentId },
    });
    return null;
  }

  return (
    <Screen>
      <Text className="text-text text-xl font-semibold mb-2">
        Configure {agent.agentName}
      </Text>

      <Text className="text-subText mb-6">
        Complete setup to start using this assistant
      </Text>

      {/* 🔽 NEXT STEP: platform-specific config UI */}
      {/* For now, just a placeholder */}

      <View className="bg-surface rounded-xl p-4">
        <Text className="text-text mb-2">Platform: {agent.platform?.type}</Text>

        <Text className="text-subText text-sm">
          Additional configuration required.
        </Text>
      </View>
    </Screen>
  );
}
