import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

import Screen from "../../../components/Screen";
import useTheme from "../../../hooks/useTheme";
import { Agent } from "../../../types/agent";
import { getPlatformImage } from "../../../utils/platformImage";
import AppCard from "../../../components/ui/AppCard";
import {
  extractUSLocalNumber,
  formatPhoneNumberUS,
} from "../../../utils/format";

export default function AgentDetails() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;

  if (!agent) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Agent details unavailable</Text>
      </Screen>
    );
  }

  const rawPhone = agent.phoneId?.phoneNumber;
  const countryCode = agent.phoneId?.countryCode ?? "";
  const isConnected = Boolean(agent.platform);

  const localDigits = extractUSLocalNumber(rawPhone);
  const formattedLocal = formatPhoneNumberUS(localDigits);

  const displayPhone =
    formattedLocal && countryCode
      ? `${countryCode} ${formattedLocal}`
      : rawPhone || "Not assigned";

  return (
    <>
      <Stack.Screen options={{ title: agent.agentName }} />

      <Screen>
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          <Image
            source={getPlatformImage(agent.platform?.type)}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={[styles.name, { color: theme.text }]}>
            {agent.agentName}
          </Text>
        </View>

        {/* ---------- PHONE ---------- */}
        <Text style={[styles.sectionLabel, { color: theme.subText }]}>
          Phone
        </Text>

        <AppCard style={styles.infoCard}>
          <MaterialIcons name="phone" size={22} color={theme.primary} />
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {displayPhone}
          </Text>
        </AppCard>

        {/* ---------- STATUS ---------- */}
        <Text style={[styles.sectionLabel, { color: theme.subText }]}>
          Status
        </Text>

        <AppCard style={styles.infoCard}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isConnected ? "#22C55E" : "#EF4444",
              },
            ]}
          />
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {isConnected ? "Active" : "Inactive"}
          </Text>
        </AppCard>

        {/* ---------- PLATFORM CONNECTION ---------- */}
        <AppCard style={styles.connectionCard}>
          <MaterialIcons
            name={isConnected ? "link-off" : "link"}
            size={48}
            color={theme.primary}
          />

          <Text style={[styles.connectionTitle, { color: theme.text }]}>
            Platform Connection
          </Text>

          <Text style={[styles.connectionSubtitle, { color: theme.subText }]}>
            Connect your platform to get started
          </Text>

          <Button
            mode={isConnected ? "outlined" : "contained"}
            style={{ marginTop: 14 }}
            onPress={() => {
              // TODO: connect / disconnect
            }}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </AppCard>
      </Screen>
    </>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  icon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
  },

  sectionLabel: {
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  connectionCard: {
    alignItems: "center",
    paddingVertical: 24,
  },

  connectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },

  connectionSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
});
