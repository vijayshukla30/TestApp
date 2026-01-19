import { useEffect, useRef } from "react";
import { Alert, BackHandler } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Screen from "../../../../components/Screen";
import AgentLayout from "../../../../components/layouts/AgentLayout";
import AgentChat, {
  AgentChatRef,
} from "../../../../components/agent/AgentChat";

import useAuth from "../../../../hooks/useAuth";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useConsumerDetails } from "../../../../hooks/useConsumerDetails";
import LoadingCard from "../../../../components/ui/LoadingCard";

export default function AgentUse() {
  const { agentId } = useLocalSearchParams<{ agentId: string }>();
  const { user } = useAuth();

  const chatRef = useRef<AgentChatRef>(null);

  const agent = useAppSelector(
    (s) =>
      s.activity.list.find((x) => x.assistantId?.uuid === agentId)?.assistantId,
  );

  const { consumer, loading, isInstalled } = useConsumerDetails(agent);

  const confirmEndChat = () => {
    Alert.alert(
      "End this assistant session?",
      "Your current conversation will be cleared.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End",
          style: "destructive",
          onPress: () => {
            chatRef.current?.end();
            router.replace("/(tabs)/home");
          },
        },
      ],
    );
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      confirmEndChat();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!agent || loading || !consumer || !isInstalled) {
    return (
      <Screen>
        <LoadingCard
          title="Preparing assistant"
          subtitle="Setting things up for you"
        />
      </Screen>
    );
  }

  return (
    <AgentLayout agent={agent} onBack={confirmEndChat}>
      <AgentChat
        ref={chatRef}
        agent={agent}
        consumer={consumer}
        userId={user?.uuid}
      />
    </AgentLayout>
  );
}
