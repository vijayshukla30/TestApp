import { Text, TextInput } from "react-native";
import { useEffect, useState, useMemo, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect, router } from "expo-router";

import Screen from "../../../components/Screen";
import useAuth from "../../../hooks/useAuth";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { Agent } from "../../../types/agent";
import { fetchAgents } from "../../../features/agent/agentsSlice";
import AgentGrid from "../../../components/agent/AgentGrid";
import AgentCard from "../../../components/agent/AgentCard";
import { colors } from "../../../theme/colors";

export default function Agents() {
  const { user, token } = useAuth();
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const { list: agents, loading } = useAppSelector((s) => s.agents);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state?.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!user?.uuid || !token || agents.length > 0) return;
      dispatch(fetchAgents({ consumerUuid: user.uuid, token }));
    }, [user?.uuid, token, agents.length]),
  );

  const onRefresh = async () => {
    if (!user?.uuid || !token) return;

    setRefreshing(true);
    await dispatch(fetchAgents({ consumerUuid: user.uuid, token })).unwrap();
    setRefreshing(false);
  };

  const uniqueAssistants = useMemo<Agent[]>(() => {
    if (!agents.length) return [];

    const platformMap = new Map<string, Agent>();

    agents.forEach((agent) => {
      const key = agent.platform?.type?.toLowerCase()?.trim();
      if (key && !platformMap.has(key)) {
        platformMap.set(key, agent);
      }
    });

    const list = Array.from(platformMap.values());

    if (!searchTerm.trim()) return list;

    return list.filter((agent) =>
      agent.agentName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [agents, searchTerm]);

  return (
    <Screen>
      <Text className="text-text text-2xl font-semibold mb-4 px-5">
        Assistants
      </Text>

      <TextInput
        placeholder="Search assistant"
        placeholderTextColor={colors.subText}
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="mx-5 mb-5 h-12 rounded-xl border border-border bg-surface px-4 text-text text-base"
      />

      {!isOnline && (
        <Text className="text-subText text-sm text-center mb-4 px-5">
          You're offline. Showing last loaded data.
        </Text>
      )}

      {!loading && uniqueAssistants.length === 0 && (
        <Text className="text-subText text-base text-center mt-14 px-5">
          No agents found
        </Text>
      )}
      <AgentGrid
        data={uniqueAssistants}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        getId={(agent) => agent.uuid}
        renderItem={(agent) => (
          <AgentCard
            agent={agent}
            onOpenDetail={() =>
              router.push({
                pathname: "/agents/[agentId]",
                params: {
                  agentId: agent.uuid,
                  agent: JSON.stringify(agent),
                  from: "agents",
                },
              })
            }
          />
        )}
      />
    </Screen>
  );
}
