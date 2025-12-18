import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { Surface } from "react-native-paper";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext)!;

  return (
    <Screen>
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
        elevation={2}
      >
        <Text style={[styles.title, { color: theme.text }]}>Welcome 👋</Text>

        <Text style={[styles.subtitle, { color: theme.subText }]}>
          {user?.name}
        </Text>

        <Text style={{ color: theme.subText, marginTop: 12 }}>
          Role: {user?.role}
        </Text>
      </Surface>
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
});
