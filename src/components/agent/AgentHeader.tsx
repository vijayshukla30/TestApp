import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import useTheme from "../../hooks/useTheme";
import { Agent } from "../../types/agent";

const AgentHeader = ({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.header}>
      <Text style={{ color: theme.text, fontWeight: "600" }}>{title}</Text>
      <Pressable onPress={onBack} style={styles.endBtn}>
        <Text style={{ color: "#EF4444", fontWeight: "600" }}>Back</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  endBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(239,68,68,0.12)",
  },
});

export default AgentHeader;
