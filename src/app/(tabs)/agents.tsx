import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import { api } from "../../services/api";

import { Agent } from "../../types/agent";
import AppCard from "../../components/ui/AppCard";
import AgentCardSkeleton from "../../components/skeltons/AgentCardSkeleton";
import { getPlatformImage } from "../../utils/platformImage";

export default function Agents() {
  const { theme } = useTheme();
  const { user, token } = useAuth();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [uniqueAssistants, setUniqueAssistants] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const fetchAgents = async () => {
    if (!isOnline) return;
    try {
      if (!user?.uuid || !token) return;

      const data = await api.getAgentsByConsumer(user.uuid, token);
      setOrganizations(data.organizations || []);
    } catch (error) {
      console.log("Agents API error:", error);
    }
  };

  // 🔹 Load organizations
  useEffect(() => {
    setLoading(true);

    fetchAgents().finally(() => {
      setLoading(false);
    });
  }, [user?.uuid, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAgents();
    setRefreshing(false);
  };

  // 🔹 WEBSITE LOGIC (UNCHANGED)
  useEffect(() => {
    if (!organizations?.length) {
      setUniqueAssistants([]);
      return;
    }

    // 1️⃣ Flatten assistants
    const orgAssistants = organizations.flatMap((o) => o.assistants || []);

    // 2️⃣ Deduplicate by platform
    const platformMap = new Map<string, Agent>();

    orgAssistants.forEach((a: Agent) => {
      if (!a) return;

      const platformName = a.platform?.type?.toLowerCase()?.trim();

      if (platformName && !platformMap.has(platformName)) {
        platformMap.set(platformName, a);
      }
    });

    // 3️⃣ Search filter
    const filtered = Array.from(platformMap.values()).filter((a) =>
      a.agentName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setUniqueAssistants(filtered);
  }, [organizations, searchTerm]);

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Agents</Text>

      {/* 🔍 Search */}
      <TextInput
        placeholder="Search agents"
        placeholderTextColor={theme.subText}
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={[
          styles.search,
          {
            backgroundColor: theme.surface,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      {!isOnline && (
        <Text style={{ color: theme.subText, marginBottom: 12 }}>
          You’re offline. Showing last loaded data.
        </Text>
      )}

      {loading && (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(i) => i.toString()}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={() => <AgentCardSkeleton />}
        />
      )}

      {!loading && uniqueAssistants.length === 0 && (
        <Text style={{ color: theme.subText, marginTop: 20 }}>
          No agents found
        </Text>
      )}

      <FlatList
        data={uniqueAssistants}
        keyExtractor={(item) => item.uuid}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]} // Android
            tintColor={theme.primary} // iOS
          />
        }
        renderItem={({ item }) => (
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
          >
            <AppCard style={styles.agentCard}>
              <Image
                source={getPlatformImage(item.platform?.type)}
                style={styles.platformImage}
                resizeMode="contain"
              />

              <Text
                style={[styles.agentName, { color: theme.text }]}
                numberOfLines={2}
              >
                {item.agentName}
              </Text>

              {item.platform?.name && (
                <Text style={[styles.platform, { color: theme.subText }]}>
                  {item.platform.name}
                </Text>
              )}
            </AppCard>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  search: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  agentCard: {
    flexBasis: "48%",
    alignItems: "center",
    paddingVertical: 20,
  },
  platformImage: {
    width: 42,
    height: 42,
    marginBottom: 12,
  },
  agentName: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  platform: {
    fontSize: 12,
    marginTop: 4,
  },
  loader: {
    marginTop: 40,
    alignItems: "center",
  },
});
