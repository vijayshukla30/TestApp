import { Text, StyleSheet, TextInput } from "react-native";
import { useEffect, useState, useMemo, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";

import Screen from "../../../components/Screen";
import useTheme from "../../../hooks/useTheme";
import useAuth from "../../../hooks/useAuth";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { Agent } from "../../../types/agent";
import { fetchAgents } from "../../../features/agent/agentsSlice";
import AgentGrid from "../../../components/agent/AgentGrid";

// FIXED: More precise responsive constants for iPhone
const HORIZONTAL_PADDING = 20; // Increased for safe areas

export default function Agents() {
  const { theme } = useTheme();
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
    }, [user?.uuid, token, agents.length])
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
      agent.agentName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, searchTerm]);

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Agents</Text>

      <TextInput
        placeholder="Search agents"
        placeholderTextColor={theme.subText}
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.surface,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      {!isOnline && (
        <Text style={[styles.offlineText, { color: theme.subText }]}>
          You're offline. Showing last loaded data.
        </Text>
      )}

      {!loading && uniqueAssistants.length === 0 && (
        <Text style={[styles.emptyText, { color: theme.subText }]}>
          No agents found
        </Text>
      )}
      <AgentGrid
        data={uniqueAssistants}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        getId={(item) => item.uuid}
        getAgent={(item) => item}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 20, // Increased
    marginHorizontal: HORIZONTAL_PADDING,
    fontSize: 16,
  },
  offlineText: {
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  emptyText: {
    marginTop: 60,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});
