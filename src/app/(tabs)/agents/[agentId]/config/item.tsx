import { Text, Pressable, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useConsumerDetails } from "../../../../../hooks/useConsumerDetails";
import Screen from "../../../../../components/Screen";
import LoadingCard from "../../../../../components/ui/LoadingCard";
import { fetchPlatformConfigurations } from "../../../../../services/platform";

const ItemStep = () => {
  const { agentId, workspaceId } = useLocalSearchParams<{
    agentId: string;
    workspaceId?: string;
  }>();

  const agent = useAppSelector((s) =>
    s.agents.list.find((a) => a.uuid === agentId),
  );
  const { consumer, loading } = useConsumerDetails(agent ?? null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!agent || !consumer?.accessToken) return;

    fetchPlatformConfigurations({
      platformId: agent.platform?.uuid,
      accessToken: consumer.accessToken,
      workspaceGid: workspaceId,
    }).then((res: any) => {
      setItems(res.items || []);
    });
  }, [agent, consumer, workspaceId]);

  if (loading || !consumer) {
    return (
      <Screen>
        <LoadingCard title="Loading projects" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="text-xl font-semibold mb-4">Select Project</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.gid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/agents/${agentId}/config/defaults`,
                params: {
                  workspaceId,
                  itemId: item.gid,
                },
              })
            }
            className="p-4 rounded-xl bg-surface mb-3"
          >
            <Text className="text-text">{item.name}</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
};

export default ItemStep;
