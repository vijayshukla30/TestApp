import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { Button, Switch, Surface } from "react-native-paper";
import { router } from "expo-router";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { AuthContext } from "../../context/AuthContext";
import AppCard from "../../components/ui/AppCard";

export default function Settings() {
  const { theme, mode, toggleTheme } = useTheme();
  const { logout, user } = useContext(AuthContext)!;

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <AppCard>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

        {/* Theme Toggle */}
        <View style={styles.row}>
          <Text style={{ color: theme.text }}>Dark Theme</Text>
          <Switch value={mode === "dark"} onValueChange={toggleTheme} />
        </View>

        {/* User Info */}
        <Text style={[styles.info, { color: theme.subText }]}>
          Logged in as {user?.email}
        </Text>

        {/* Logout */}
        <Button mode="contained" onPress={onLogout} style={{ marginTop: 20 }}>
          Logout
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
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    marginTop: 12,
  },
});
