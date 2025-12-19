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

  const phoneNumber = agent.phoneId?.phoneNumber || "Not assigned";
  const countryCode = agent?.phoneId?.countryCode || "";
  const isConnected = Boolean(agent.platform);

  const localDigits = extractUSLocalNumber(phoneNumber);
  const formattedLocal = formatPhoneNumberUS(localDigits);

  const displayPhone = `${countryCode} ${formattedLocal}`;

  return (
    <>
      {/* 🔹 Header title */}
      <Stack.Screen
        options={{
          title: agent.agentName,
        }}
      />

      <Screen>
        {/* 🔹 Top icon + name */}
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

        {/* 📞 Phone + 🟢 Status */}
        <View style={styles.rowCards}>
          <AppCard style={styles.halfCard}>
            <View style={styles.iconRow}>
              <MaterialIcons name="phone" size={16} color={theme.subText} />
              <Text style={[styles.label, { color: theme.subText }]}>
                Phone
              </Text>
            </View>
            <Text style={[styles.value, { color: theme.text }]}>
              {displayPhone}
            </Text>
          </AppCard>

          <AppCard style={styles.halfCard}>
            <Text style={[styles.label, { color: theme.subText }]}>Status</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isConnected ? "#22C55E" : "#EF4444",
                  },
                ]}
              />
              <Text style={[styles.value, { color: theme.text }]}>
                {isConnected ? "Active" : "Inactive"}
              </Text>
            </View>
          </AppCard>
        </View>

        {/* 🔗 Platform Connection */}
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

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 16,
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

  rowCards: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  halfCard: {
    flex: 1,
    paddingVertical: 14,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  label: {
    fontSize: 12,
    marginBottom: 4,
  },

  value: {
    fontSize: 12,
    fontWeight: "600",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
