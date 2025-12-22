import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import AppCard from "../ui/AppCard";
import useTheme from "../../hooks/useTheme";
import { getPlatformCapabilities } from "../../utils/platform";
import ToolDetails from "./ToolDetails";

type Props = {
  platformName: string | any;
};

const GennieTools = ({ platformName }: Props) => {
  const { theme } = useTheme();
  const capabilities = getPlatformCapabilities(platformName);

  const [showAvailable, setShowAvailable] = useState(true);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const available = capabilities.filter((t) => t.available);
  const unavailable = capabilities.filter((t) => !t.available);

  return (
    <AppCard style={styles.toolsCard}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Asana Tools
      </Text>

      <Text style={[styles.sectionDesc, { color: theme.subText }]}>
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
    </AppCard>
  );
};

const styles = StyleSheet.create({
  toolsCard: {
    paddingVertical: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
});

export default GennieTools;
