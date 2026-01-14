import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";

type Props = {
  messages: any[];
  onOpenHistory: () => void;
};

export default function ChatContextDock({ messages, onOpenHistory }: Props) {
  const { theme } = useTheme();
  const preview = messages.slice(-3);

  if (!preview.length) return null;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: "rgba(255,255,255,0.08)",
          },
        ]}
      >
        <Pressable onPress={onOpenHistory} style={styles.historyBtn}>
          <MaterialIcons name="history" size={18} color={theme.subText} />
        </Pressable>

        {preview.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              {
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  m.role === "user" ? theme.primary : "rgba(255,255,255,0.06)",
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: m.role === "user" ? theme.background : theme.text,
              }}
            >
              {m.content}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  card: {
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
  },
  historyBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginVertical: 4,
    maxWidth: "85%",
  },
});
