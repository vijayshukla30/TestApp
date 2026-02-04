import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Screen from "../../../components/Screen";
import { Agent } from "../../../types/agent";
import AgentDetail from "../../../components/agent/AgentDetail";
import { useAppSelector } from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import useAuth from "../../../hooks/useAuth";
import { fetchAgents } from "../../../features/agent/agentsSlice";
import LoadingCard from "../../../components/ui/LoadingCard";

export default function AgentDetails() {
  const params = useLocalSearchParams<{
    agent?: string;
    agentId?: string;
  }>();
  const dispatch = useAppDispatch();
  const { user, token } = useAuth();
  const agentsState = useAppSelector((s) => s.agents);

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;

  const agentId = params.agentId;
  const agentFromStore =
    agentId && !agent
      ? agentsState.list.find((a) => a.uuid === agentId) || null
      : null;

  const resolvedAgent = agent ?? agentFromStore;

  useEffect(() => {
    if (!agentId || resolvedAgent || agentsState.loading) return;
    if (!user?.uuid || !token) return;

    dispatch(fetchAgents({ consumerUuid: user.uuid, token }));
  }, [
    agentId,
    resolvedAgent,
    agentsState.loading,
    user?.uuid,
    token,
    dispatch,
  ]);

  if (agentsState.loading && !resolvedAgent) {
    return (
      <Screen>
        <LoadingCard title="Loading agent" subtitle="Fetching details" />
      </Screen>
    );
  }

  if (!resolvedAgent) {
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

  return <AgentDetail agent={resolvedAgent} />;
}
