import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import {
  useLocalSearchParams,
  Stack,
  router,
  useFocusEffect,
} from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../../../components/Screen";
import useTheme from "../../../hooks/useTheme";
import { Agent } from "../../../types/agent";
import { getPlatformImage } from "../../../utils/platform";
import AppCard from "../../../components/ui/AppCard";
import {
  extractUSLocalNumber,
  formatPhoneNumberUS,
} from "../../../utils/format";
import ConnectionSection from "../../../components/agent/ConnectionSection";
import GennieTools from "../../../components/agent/GennieTools";
import { useConsumerDetails } from "../../../hooks/useConsumerDetails";
import { usePlatformConnection } from "../../../hooks/usePlatformConnection";
import AgentLayout from "../../../components/layouts/AgentLayout";

export default function AgentDetails() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;
  console.log("params :>> ", params);
  console.log("agent :>> ", agent);

  const { consumer, loading, isInstalled } = useConsumerDetails(agent);
  const { connectPlatform, disconnectPlatform } = usePlatformConnection();

  if (!agent) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Agent details unavailable</Text>
      </Screen>
    );
  }

  const rawPhone = agent.phoneId?.phoneNumber;
  const countryCode = agent.phoneId?.countryCode ?? "";

  const localDigits = extractUSLocalNumber(rawPhone);
  const formattedLocal = formatPhoneNumberUS(localDigits);

  const displayPhone =
    formattedLocal && countryCode
      ? `${countryCode} ${formattedLocal}`
      : rawPhone || "Not assigned";

  const platformName = agent.platform?.type?.toLowerCase();

  const onConnect = async () => {
    await connectPlatform(agent, consumer);
  };

  const headerLeft = () => (
    <Pressable
      onPress={() => {
        if (params?.from === "home") {
          router.push("/(tabs)/home");
        } else {
          router.back();
        }
      }}
    >
      <MaterialIcons name="arrow-back" size={24} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: agent.agentName,
          headerLeft,
        }}
      />

      <AgentLayout agent={agent} onBack={() => router.back()}>
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

          <Text style={[styles.sectionLabel, { color: theme.subText }]}>
            Status
          </Text>

          <AppCard style={styles.infoCard}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isInstalled ? "#22C55E" : "#EF4444" },
              ]}
            />
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {isInstalled ? "Active" : "Inactive"}
            </Text>
          </AppCard>

          <ConnectionSection
            loading={loading}
            installed={isInstalled}
            onConnect={onConnect}
            onDisconnect={() => disconnectPlatform(agent)}
          />

          <GennieTools
            platformName={platformName}
            agentName={agent.agentName}
          />
        </ScrollView>
      </AgentLayout>
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
