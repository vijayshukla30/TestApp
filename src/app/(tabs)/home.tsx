import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import useAppDispatch from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchUserActivity } from "../../features/activity/activitySlice";
import AgentGrid from "../../components/agent/AgentGrid";

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

  const installed = list.filter((x) => x.isInstalled);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.subText }]}>
          Welcome back 👋
        </Text>
        <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
      </View>
      <AgentGrid
        data={installed}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        getId={(item) => item.assistantId.uuid}
        getAgent={(item) => item.assistantId}
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
