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
    <View
      className="rounded-2xl 
        border border-border dark:border-dark-border
        bg-surface dark:bg-dark-surface
        px-5 py-6 mb-6
        shadow-sm dark:shadow-md"
    >
      <Text className="text-text dark:text-dark-text text-base font-bold mb-2">
        {agentName} Tools
      </Text>

      <Text className="text-subText dark:text-dark-subText text-xs leading-5 mb-5">
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
      {available.length === 0 && unavailable.length === 0 && (
        <Text className="text-subText dark:text-dark-subText text-sm text-center py-4">
          No tools available for this platform
        </Text>
      )}
    </View>
  );
};

export default GennieTools;
