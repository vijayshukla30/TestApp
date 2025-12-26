import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import AppCard from "../../components/ui/AppCard";
import useAuth from "../../hooks/useAuth";
import useAppDispatch from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchUserActivity } from "../../features/activity/activitySlice";

export default function Home() {
  const { theme } = useTheme();
  const { user, token } = useAuth()!;
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.activity);

  useEffect(() => {
    dispatch(fetchUserActivity({ token }));
  }, []);

  const installed = list.filter((x) => x.isInstalled);
  console.log("installed :>> ", installed);
  return (
    <Screen>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.subText }]}>
          Welcome back 👋
        </Text>
        <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
      </View>

      {/* Section */}
      <Text style={[styles.sectionTitle, { color: theme.subText }]}>
        Integrations
      </Text>

      <AppCard>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Connect your tools
        </Text>

        <Text style={[styles.cardSubtitle, { color: theme.subText }]}>
          Integrate your workflow tools to automate tasks and stay in sync.
        </Text>
      </AppCard>

      {/* Empty state */}
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: theme.subText }]}>
          More integrations coming soon 🚀
        </Text>
      </View>
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

  sectionTitle: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  cardSubtitle: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  emptyState: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
  },
});
