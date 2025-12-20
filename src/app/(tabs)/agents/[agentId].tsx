import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

import Screen from "../../../components/Screen";
import useTheme from "../../../hooks/useTheme";
import { Agent } from "../../../types/agent";
import {
  getPlatformCapabilities,
  getPlatformImage,
} from "../../../utils/platform";
import AppCard from "../../../components/ui/AppCard";
import {
  extractUSLocalNumber,
  formatPhoneNumberUS,
} from "../../../utils/format";
import ToolChip from "../../../components/ui/ToolChip";

export default function AgentDetails() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const [showAvailable, setShowAvailable] = useState(true);
  const [showUnavailable, setShowUnavailable] = useState(false);

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

  /* ---------- Derived values ---------- */

  const rawPhone = agent.phoneId?.phoneNumber;
  const countryCode = agent.phoneId?.countryCode ?? "";
  const isConnected = Boolean(agent.platform);

  const localDigits = extractUSLocalNumber(rawPhone);
  const formattedLocal = formatPhoneNumberUS(localDigits);

  const displayPhone =
    formattedLocal && countryCode
      ? `${countryCode} ${formattedLocal}`
      : rawPhone || "Not assigned";

  const platformName = agent.platform?.type?.toLowerCase();
  const capabilities = getPlatformCapabilities(platformName);

  const available = capabilities.filter((t) => t.available);
  const unavailable = capabilities.filter((t) => !t.available);

  /* ---------- UI helpers ---------- */

  const SectionHeader = ({
    title,
    open,
    onPress,
  }: {
    title: string;
    open: boolean;
    onPress: () => void;
  }) => (
    <Pressable onPress={onPress} style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <MaterialIcons
        name={open ? "expand-less" : "expand-more"}
        size={20}
        color={theme.subText}
      />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen options={{ title: agent.agentName }} />

      <Screen>
        <ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* ---------- Sticky Header ---------- */}
          <View
            style={[styles.stickyHeader, { backgroundColor: theme.background }]}
          >
            <Image
              source={getPlatformImage(agent.platform?.type)}
              style={styles.stickyIcon}
            />
            <Text
              numberOfLines={1}
              style={[styles.stickyTitle, { color: theme.text }]}
            >
              {agent.agentName}
            </Text>
          </View>

          {/* ---------- Hero Header ---------- */}
          <View style={styles.heroHeader}>
            <Image
              source={getPlatformImage(agent.platform?.type)}
              style={styles.heroIcon}
            />
            <Text style={[styles.heroTitle, { color: theme.text }]}>
              {agent.agentName}
            </Text>
          </View>

          {/* ---------- Phone ---------- */}
          <Text style={[styles.sectionLabel, { color: theme.subText }]}>
            Phone
          </Text>

          <AppCard style={styles.infoCard}>
            <MaterialIcons name="phone" size={22} color={theme.primary} />
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {displayPhone}
            </Text>
          </AppCard>

          {/* ---------- Status ---------- */}
          <Text style={[styles.sectionLabel, { color: theme.subText }]}>
            Status
          </Text>

          <AppCard style={styles.infoCard}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConnected ? "#22C55E" : "#EF4444" },
              ]}
            />
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {isConnected ? "Active" : "Inactive"}
            </Text>
          </AppCard>

          {/* ---------- Tools ---------- */}
          <AppCard style={styles.toolsCard}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Asana Tools
            </Text>

            <Text style={[styles.sectionDesc, { color: theme.subText }]}>
              Create, update, delete, and manage tasks using this agent with
              authentication.
            </Text>

            {available.length > 0 && (
              <>
                <SectionHeader
                  title={`Available (${available.length})`}
                  open={showAvailable}
                  onPress={() => setShowAvailable((v) => !v)}
                />

                {showAvailable && (
                  <View style={styles.chipsWrap}>
                    {available.map((tool) => (
                      <ToolChip key={tool.name} label={tool.name} available />
                    ))}
                  </View>
                )}
              </>
            )}

            {unavailable.length > 0 && (
              <>
                <SectionHeader
                  title={`Unavailable (${unavailable.length})`}
                  open={showUnavailable}
                  onPress={() => setShowUnavailable((v) => !v)}
                />

                {showUnavailable && (
                  <View style={styles.chipsWrap}>
                    {unavailable.map((tool) => (
                      <ToolChip
                        key={tool.name}
                        label={tool.name}
                        available={false}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
          </AppCard>

          {/* ---------- Platform Connection ---------- */}
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
        </ScrollView>
      </Screen>
    </>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  stickyHeader: {
    height: 56,
    paddingVertical: 16,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  stickyIcon: {
    width: 26,
    height: 26,
  },

  stickyTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  heroHeader: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 28,
  },

  heroIcon: {
    width: 72,
    height: 72,
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
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

  toolsCard: {
    paddingVertical: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  sectionDesc: {
    fontSize: 13,
    marginBottom: 14,
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  connectionCard: {
    alignItems: "center",
    paddingVertical: 24,
    marginTop: 24,
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
