import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";

type Props = {
  messages: any[];
  onOpenHistory: () => void;
};

export default function ChatContextCard({ messages, onOpenHistory }: Props) {
  const { theme } = useTheme();

  if (!messages.length) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: "rgba(255,255,255,0.08)",
        },
      ]}
    >
      {/* HISTORY ICON */}
      <Pressable onPress={onOpenHistory} hitSlop={12} style={styles.historyBtn}>
        <MaterialIcons name="history" size={20} color={theme.subText} />
      </Pressable>

      {/* PREVIEW MESSAGES */}
      <FlatList
        data={messages.slice(-3)}
        keyExtractor={(i) => i.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              {
                alignSelf: item.role === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  item.role === "user"
                    ? theme.primary
                    : "rgba(255,255,255,0.06)",
              },
            ]}
          >
            <Text
              style={{
                color: item.role === "user" ? theme.background : theme.text,
                fontSize: 14,
              }}
              numberOfLines={2}
            >
              {item.content}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    position: "relative",
  },

  historyBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginVertical: 4,
    maxWidth: "85%",
  },
});
