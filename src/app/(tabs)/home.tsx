import { Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { Surface, Button } from "react-native-paper";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { AuthContext } from "../../context/AuthContext";
import { useAsanaAuth } from "../../hooks/useAsanaAuth";
import AppCard from "../../components/ui/AppCard";

export default function Home() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext)!;
  const { connectAsana } = useAsanaAuth();

  return (
    <Screen>
      <AppCard>
        <Text style={[styles.title, { color: theme.text }]}>Welcome 👋</Text>

        <Text style={[styles.subtitle, { color: theme.subText }]}>
          {user?.name}
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
  },
  /* Asana button styles */
  asanaButton: {
    marginTop: 24,
    backgroundColor: "#F06A6A", // Asana brand
    borderRadius: 10,
  },
  asanaContent: {
    paddingVertical: 6,
  },
  asanaLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
