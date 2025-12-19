import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { AuthContext } from "../../context/AuthContext";
import { useAsanaAuth } from "../../hooks/useAsanaAuth";
import { Button } from "react-native-paper";
import AppCard from "../../components/ui/AppCard";

export default function Home() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext)!;
  const { connectAsana } = useAsanaAuth();

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

        <Button
          mode="contained"
          onPress={connectAsana}
          style={styles.asanaButton}
          contentStyle={styles.asanaContent}
          labelStyle={styles.asanaLabel}
        >
          Connect Asana
        </Button>
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

  asanaButton: {
    marginTop: 20,
    backgroundColor: "#F06A6A",
    borderRadius: 12,
  },

  asanaContent: {
    paddingVertical: 2,
  },

  asanaLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  emptyState: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
  },
});
