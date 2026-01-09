import { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useAuth from "../../../../hooks/useAuth";
import Screen from "../../../../components/Screen";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { fetchConsumerByAgent } from "../../../../features/consumer/consumerSlice";
import { AgentChat } from "../../../../components/agent/AgentChat";
import { useConsumerDetails } from "../../../../hooks/useConsumerDetails";

export default function AgentUse() {
  const { agentId } = useLocalSearchParams<{ agentId: string }>();
  const { user, token } = useAuth();
  const dispatch = useAppDispatch();

  const agent = useAppSelector(
    (s) =>
      s.activity.list.find((x) => x.assistantId.uuid === agentId)?.assistantId
  );

  const { consumer, loading, isInstalled } = useConsumerDetails(agent);
  if (!agent || loading || !consumer || !isInstalled) {
    return (
      <Screen>
        <Text>Loading ...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <AgentChat agent={agent} consumer={consumer} userId={user?.uuid} />
    </Screen>
  );
}

const styles = StyleSheet.create({});
