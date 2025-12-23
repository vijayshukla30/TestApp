import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
  Pressable,
  ListRenderItemInfo,
} from "react-native";
import { useEffect, useState, useMemo, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { router, useFocusEffect } from "expo-router";

import Screen from "../../../components/Screen";
import useTheme from "../../../hooks/useTheme";
import useAuth from "../../../hooks/useAuth";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { Agent } from "../../../types/agent";
import AppCard from "../../../components/ui/AppCard";
import AgentCardSkeleton from "../../../components/skeltons/AgentCardSkeleton";
import { getPlatformImage } from "../../../utils/platform";
import { fetchAgents } from "../../../features/agent/agentsSlice";

// FIXED: More precise responsive constants for iPhone
const HORIZONTAL_PADDING = 20; // Increased for safe areas
const GAP = 16; // Slightly larger horizontal gap
const ROW_GAP = 16; // NEW: Vertical spacing between rows
const NUM_COLUMNS = 2;

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

  const renderAgentItem = ({ item }: ListRenderItemInfo<Agent>) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/agents/[agentId]",
          params: {
            agentId: item.uuid,
            agent: JSON.stringify(item),
          },
        })
      }
      style={styles.cardContainer}
    >
      <AppCard variant="default" style={styles.agentCard}>
        <Image
          source={getPlatformImage(item.platform?.type)}
          style={styles.platformImage}
          resizeMode="contain"
        />
        <Text
          style={[styles.agentName, { color: theme.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={12}
        >
          {item.agentName}
        </Text>
      </AppCard>
    </Pressable>
  );

  // NEW: Vertical row separator
  const ItemSeparator = () => <View style={{ height: ROW_GAP }} />;

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

      {/* Skeleton */}
      {loading && (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => `skeleton-${item}`}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={() => (
            <View style={styles.cardContainer}>
              <AgentCardSkeleton />
            </View>
          )}
        />
      )}

      {/* Real List */}
      {!loading && (
        <FlatList
          data={uniqueAssistants}
          keyExtractor={(item) => item.uuid}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator} // ← FIXES vertical spacing
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
          renderItem={renderAgentItem}
        />
      )}
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
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 40,
  },
  columnWrapper: {
    gap: GAP,
    justifyContent: "space-between", // Perfect even distribution
  },
  cardContainer: {
    flexBasis: "48%", // ← PERFECT FIX: 48% + gap = perfect fit
  },
  agentCard: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 28, // Slightly more vertical padding
  },
  platformImage: {
    width: 56, // Slightly larger
    height: 56,
    marginBottom: 16,
  },
  agentName: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 8, // Give breathing room on sides
  },
});
