import { useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { Agent } from "../../../../../types/agent";
import { useConsumerDetails } from "../../../../../hooks/useConsumerDetails";
import Screen from "../../../../../components/Screen";
import LoadingCard from "../../../../../components/ui/LoadingCard";
import { decodeAuthState } from "../../../../../utils/auth";

export default function AgentConfigScreen() {
  const { agentId, cState } = useLocalSearchParams<{
    agentId: string;
    cState: string;
  }>();
  const agent = useAppSelector(
    (s) => s.agents.list.find((a) => a.uuid === agentId) as Agent | undefined,
  );

  const decoded = cState ? decodeAuthState(cState) : null;
  if (decoded) {
    console.log("decoded agent config:>> ", decoded);
  }

  const { consumer, loading, isInstalled } = useConsumerDetails(agent ?? null);
  console.log("consumer :>> ", consumer);

  useEffect(() => {
    if (!agent || loading || !consumer) return;

    if (isInstalled) {
      router.replace(`/agents/${agentId}`);
      return;
    }

    const platform = agent.platform?.type?.toLowerCase();
    console.log("platform :>> ", platform);

    // Platforms with workspace selection
    if (platform === "asana" || platform === "trello") {
      console.log("Redirecting to workspace");
      router.replace({
        pathname: `/agents/${agentId}/config/workspace`,
        params: {
          agentId,
          cState,
        },
      });
    } else {
      console.log("Redirecting to item");
      router.replace({
        pathname: `/agents/${agentId}/config/item`,
        params: {
          agentId,
          cState,
        },
      });
    }
  }, [agent, consumer, loading]);

  return (
    <Screen>
      <LoadingCard
        title="Preparing setup"
        subtitle="Setting things up for you"
      />
    </Screen>
  );
}
