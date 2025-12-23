import { View, Text, StyleSheet } from "react-native";
import { Switch, Button } from "react-native-paper";
import { router } from "expo-router";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import AppCard from "../../components/ui/AppCard";
import useAuth from "../../hooks/useAuth";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth()!;

  const isDark = theme.mode === "dark";

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      {/* Section title */}
      <Text style={[styles.sectionTitle, { color: theme.subText }]}>
        Account
      </Text>

      <AppCard>
        <Text style={[styles.label, { color: theme.subText }]}>
          Signed in as
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.email}</Text>
      </AppCard>

      {/* Preferences */}
      <Text
        style={[styles.sectionTitle, { color: theme.subText, marginTop: 28 }]}
      >
        Preferences
      </Text>

      <AppCard>
        <View style={styles.row}>
          <Text style={{ color: theme.text, fontSize: 16 }}>Dark theme</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </AppCard>

      {/* Danger zone */}
      <Text
        style={[styles.sectionTitle, { color: theme.subText, marginTop: 28 }]}
      >
        Danger Zone
      </Text>

      <AppCard>
        <Button
          mode="contained"
          onPress={onLogout}
          style={styles.logoutButton}
          contentStyle={{ paddingVertical: 2 }}
        >
          Sign out
        </Button>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoutButton: {
    backgroundColor: "#EF4444", // danger red
    borderRadius: 10,
  },
});
