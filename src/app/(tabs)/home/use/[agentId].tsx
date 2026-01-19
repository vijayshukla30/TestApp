import { Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useAuth from "../../../../hooks/useAuth";
import Screen from "../../../../components/Screen";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useConsumerDetails } from "../../../../hooks/useConsumerDetails";
import AgentChat from "../../../../components/agent/AgentChat";
import LoadingCard from "../../../../components/ui/LoadingCard";

export default function AgentUse() {
  const { agentId } = useLocalSearchParams<{ agentId: string }>();
  const { user } = useAuth();

  const agent = useAppSelector(
    (s) =>
      s.activity.list.find((x) => x.assistantId.uuid === agentId)?.assistantId,
  );

  const { consumer, loading, isInstalled } = useConsumerDetails(agent);
  if (!agent || loading || !consumer || !isInstalled) {
    return (
      <Screen center>
        <LoadingCard
          title="Preparing assistant"
          subtitle="Setting things up for you"
        />
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
