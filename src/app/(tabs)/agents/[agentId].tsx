import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../../../components/Screen";
import { Agent } from "../../../types/agent";
import { getPlatformImage } from "../../../utils/platform";
import {
  extractUSLocalNumber,
  formatPhoneNumberUS,
} from "../../../utils/format";
import ConnectionSection from "../../../components/agent/ConnectionSection";
import GennieTools from "../../../components/agent/GennieTools";
import { useConsumerDetails } from "../../../hooks/useConsumerDetails";
import { usePlatformConnection } from "../../../hooks/usePlatformConnection";
import AgentLayout from "../../../components/layouts/AgentLayout";
import Card from "../../../components/ui/Card";
import { colors } from "../../../theme/colors";

export default function AgentDetails() {
  const params = useLocalSearchParams();

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;

  const { consumer, loading, isInstalled } = useConsumerDetails(agent);
  const { connectPlatform, disconnectPlatform } = usePlatformConnection();

  if (!agent) {
    return (
      <Screen>
        <Text className="text-text">Agent details unavailable</Text>
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
          <View className="h-14 px-4 justify-center border-b border-border bg-background">
            <Image
              source={getPlatformImage(agent.platform?.type)}
              className="w-6 h-6"
            />
            <Text
              numberOfLines={1}
              className="absolute left-0 right-0 text-center text-text font-semibold text-base"
            >
              {agent.agentName}
            </Text>
          </View>

          <View className="items-center mt-6 mb-7">
            <Image
              source={getPlatformImage(agent.platform?.type)}
              className="w-18 h-18 mb-3"
            />
            <Text className="text-text text-xl font-bold">
              {agent.agentName}
            </Text>
          </View>

          <Text className="text-subText text-xs mb-1 ml-1">Phone</Text>

          <Card className="flex-row items-center gap-3 py-3 mb-4">
            <MaterialIcons name="phone" size={22} color={colors.primary} />
            <Text className="text-text text-base font-semibold">
              {displayPhone}
            </Text>
          </Card>

          <Text className="text-subText text-xs mb-1 ml-1">Status</Text>
          <Card className="flex-row items-center gap-3 py-3 mb-4">
            <View
              className={`w-3 h-3 rounded-full ${
                isInstalled ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <Text className="text-text text-base font-semibold">
              {isInstalled ? "Active" : "Inactive"}
            </Text>
          </Card>

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
