import { View, Text, Image, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getPlatformImage } from "../../utils/platform";
import ConnectionSection from "./ConnectionSection";
import GennieTools from "./GennieTools";
import AgentLayout from "../layouts/AgentLayout";
import Card from "../ui/Card";
import { colors } from "../../theme/colors";
import { useConsumerDetails } from "../../hooks/useConsumerDetails";
import { usePlatformConnection } from "../../hooks/usePlatformConnection";
import { extractUSLocalNumber, formatPhoneNumberUS } from "../../utils/format";
import { Agent } from "../../types/agent";

const AgentDetail = ({ agent }: { agent: Agent }) => {
  const { consumer, loading, isInstalled } = useConsumerDetails(agent);
  const { connectPlatform, disconnectPlatform } = usePlatformConnection();

  const rawPhone = agent.phoneId?.phoneNumber;
  const countryCode = agent.phoneId?.countryCode ?? "";

  const localDigits = extractUSLocalNumber(rawPhone);
  const formattedLocal = formatPhoneNumberUS(localDigits);

  const displayPhone =
    formattedLocal && countryCode
      ? `${countryCode} ${formattedLocal}`
      : rawPhone || "Not assigned";

  const platformName = agent.platform?.type?.toLowerCase();

  return (
    <AgentLayout agent={agent} onBack={() => router.back()}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero */}
        <View className="items-center mt-6 mb-8">
          <View className="w-24 h-24 rounded-2xl bg-surface items-center justify-center mb-3">
            <Image
              source={getPlatformImage(agent.platform?.type)}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>

          <Text className="text-text text-xl font-bold">{agent.agentName}</Text>
        </View>

        {/* Phone */}
        <Text className="text-subText text-xs mb-1 ml-1">Phone</Text>
        <Card className="flex-row items-center gap-3 p-3 mb-4">
          <MaterialIcons name="phone" size={22} color={colors.primary} />
          <Text className="text-text text-base font-semibold">
            {displayPhone}
          </Text>
        </Card>

        {/* Status */}
        <Text className="text-subText text-xs mb-1 ml-1">Status</Text>
        <Card className="flex-row items-center gap-3 p-3 mb-4">
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
          onConnect={() => connectPlatform(agent, consumer)}
          onDisconnect={() => disconnectPlatform(agent)}
        />

        <GennieTools platformName={platformName} agentName={agent.agentName} />
      </ScrollView>
    </AgentLayout>
  );
};

export default AgentDetail;
