import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

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
import ConnectionSection from "../../../components/agent/ConnectionSection";
import GennieTools from "../../../components/agent/GennieTools";
import { buildAuthUrl, createAuthState } from "../../../utils/auth";
import { openAuthLink } from "../../../utils/openAuthLink";
import { api } from "../../../services/api";

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

  const onConnect = async () => {
    try {
      const consumer: any = {};
      console.log("Connect platform clicked for:", agent.agentName);
      const state = createAuthState(consumer, agent.uuid);
      let data;
      try {
        data = await api.fetchAuthProfile(state);
      } catch (err) {
        console.log("Profile check failed, redirecting to auth");
      }

      if (!data?.profile) {
        const authUrl = buildAuthUrl(agent.uuid, state);
        await openAuthLink(authUrl);
        return;
      }
      console.log("Profile exists:", data.profile);
    } catch (error) {
      console.error("Connect platform error:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if ((params.from = "home")) {
                  router.replace("/(tabs)/home");
                } else {
                  router.back();
                }
              }}
            >
              <MaterialIcons name="arrow-back" size={24} />
            </Pressable>
          ),
        }}
      />

      <Screen>
        <ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
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

          <View style={styles.heroHeader}>
            <Image
              source={getPlatformImage(agent.platform?.type)}
              style={styles.heroIcon}
            />
            <Text style={[styles.heroTitle, { color: theme.text }]}>
              {agent.agentName}
            </Text>
          </View>

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

          <ConnectionSection onConnect={onConnect} />

          <GennieTools
            platformName={platformName}
            agentName={agent.agentName}
          />
        </ScrollView>
      </Screen>
    </>
  );
}

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
});
