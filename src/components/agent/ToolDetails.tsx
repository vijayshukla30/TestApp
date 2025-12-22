import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import ToolChip from "../ui/ToolChip";

type Tool = {
  name: string;
  available: boolean;
  // add other fields if needed
};

type Props = {
  title: string;
  tools: Tool[];
  isAvailableSection: boolean; // true = available tools, false = unavailable
  open: boolean;
  onToggle: () => void;
};

const ToolDetails = ({
  title,
  tools,
  isAvailableSection,
  open,
  onToggle,
}: Props) => {
  const { theme } = useTheme();

  const SectionHeader = () => (
    <Pressable onPress={onToggle} style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {title} ({tools.length})
      </Text>
      <MaterialIcons
        name={open ? "expand-less" : "expand-more"}
        size={24}
        color={theme.subText}
      />
    </Pressable>
  );

  return (
    <>
      <SectionHeader />

      {open && (
        <View style={styles.chipsWrap}>
          {tools.map((tool) => (
            <ToolChip
              key={tool.name}
              label={tool.name}
              available={isAvailableSection}
            />
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
});

export default ToolDetails;
