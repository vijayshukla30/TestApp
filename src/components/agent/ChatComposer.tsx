import React, { useState } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Text,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import AppCard from "../ui/AppCard";
import { AttachmentSheet } from "./AttachmentSheet";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onHistory: () => void;
};

export default function ChatComposer({
  value,
  onChange,
  onSend,
  onHistory,
}: Props) {
  const { theme } = useTheme();
  const [showAttachments, setShowAttachments] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* TEXT INPUT CARD */}
      <AppCard style={[styles.card, { backgroundColor: theme.surface }]}>
        <BlurView
          intensity={25}
          tint={theme.mode === "dark" ? "dark" : "light"}
          style={styles.textCard}
        >
          <Pressable onPress={onHistory} hitSlop={10}>
            <MaterialIcons name="history" size={22} color={theme.subText} />
          </Pressable>

          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Type or speak…"
            placeholderTextColor={theme.subText}
            multiline
            textAlignVertical="top"
            style={[styles.textArea, { color: theme.text }]}
          />
        </BlurView>
      </AppCard>

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        <Pressable
          onPress={onSend}
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        >
          <MaterialIcons name="send" size={18} color="#000" />
          <Text style={styles.primaryText}>Send</Text>
        </Pressable>

        <Pressable
          onPress={() => setShowAttachments(true)}
          style={[styles.iconBtn, { backgroundColor: theme.surface }]}
        >
          <MaterialIcons name="photo-camera" size={22} color={theme.subText} />
        </Pressable>
      </View>
      {/* ATTACHMENT SHEET */}
      <AttachmentSheet
        visible={showAttachments}
        onClose={() => setShowAttachments(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },

  card: {
    borderRadius: 24,
    padding: 6,
  },

  textCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  textArea: {
    flex: 1,
    minHeight: 90,
    maxHeight: 150,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    fontSize: 15,
  },

  actionBar: {
    flexDirection: "row",
    gap: 12,
  },

  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  primaryText: {
    fontSize: 15,
    fontWeight: "600",
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  sendBtn: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  sendText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
