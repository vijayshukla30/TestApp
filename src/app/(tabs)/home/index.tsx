import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";
import useTheme from "../../../hooks/useTheme";
import useAuth from "../../../hooks/useAuth";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { fetchUserActivity } from "../../../features/activity/activitySlice";
import Screen from "../../../components/Screen";
import AgentGrid from "../../../components/agent/AgentGrid";
import HomeAgentCard from "../../../components/agent/HomeAgentCard";
import InstallAgentCard from "../../../components/agent/InstallAgentCard";

export default function Home() {
  const { theme } = useTheme();
  const { user, token } = useAuth()!;
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.activity);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;

      dispatch(fetchUserActivity({ token }));
    }, [token])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchUserActivity({ token })).unwrap();
    setRefreshing(false);
  };

  const installed = list.filter((x) => x.isInstalled && x.assistantId?.uuid);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.subText }]}>
          Welcome back 👋
        </Text>
        <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
      </View>
      <AgentGrid
        data={[...installed, { __install__: true }]}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        getId={(item) =>
          item.__install__ ? "install-card" : item.assistantId.uuid
        }
        renderItem={(item) =>
          item.__install__ ? (
            <InstallAgentCard onPress={() => router.push("/agents")} />
          ) : (
            <HomeAgentCard
              agent={item.assistantId}
              onOpenDetail={() =>
                router.push({
                  pathname: "/agents/[agentId]",
                  params: {
                    agentId: item.assistantId.uuid,
                    agent: JSON.stringify(item.assistantId),
                    from: "home",
                  },
                })
              }
              onUseNow={() =>
                router.push({
                  pathname: "/home/use/[agentId]",
                  params: {
                    agentId: item.assistantId.uuid,
                    from: "home",
                  },
                })
              }
            />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 4,
  },
});
