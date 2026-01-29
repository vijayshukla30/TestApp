import React, { useState } from "react";
import { Text, View } from "react-native";
import { getPlatformCapabilities } from "../../utils/platform";
import ToolDetails from "./ToolDetails";

type Props = {
  platformName: string | any;
  agentName: string | any;
};

const GennieTools = ({ platformName, agentName }: Props) => {
  const capabilities = getPlatformCapabilities(platformName);

  const [showAvailable, setShowAvailable] = useState(true);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const available = capabilities.filter((t) => t.available);
  const unavailable = capabilities.filter((t) => !t.available);

  return (
    <View className="rounded-2xl border border-white/10 bg-surface px-5 py-5">
      <Text className="text-text text-base font-bold mb-2">
        {agentName} Tools
      </Text>

      <Text className="text-subText text-xs leading-5 mb-4">
        Create, update, delete, and manage tasks using this agent with
        authentication.
      </Text>

      {available.length > 0 && (
        <ToolDetails
          title="Available"
          tools={available}
          isAvailableSection={true}
          open={showAvailable}
          onToggle={() => setShowAvailable((prev) => !prev)}
        />
      )}

      {unavailable.length > 0 && (
        <ToolDetails
          title="Unavailable"
          tools={unavailable}
          isAvailableSection={false}
          open={showUnavailable}
          onToggle={() => setShowUnavailable((prev) => !prev)}
        />
      )}
    </View>
  );
};

export default GennieTools;
