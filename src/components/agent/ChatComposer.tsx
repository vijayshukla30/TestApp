import React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import AppCard from "../ui/AppCard";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onHistory: () => void;
};

const ChatComposer = ({ value, onChange, onSend, onHistory }: Props) => {
  const { theme } = useTheme();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <AppCard
        style={[
          styles.outer,
          {
            backgroundColor: theme.surface,
            padding: 5,
          },
        ]}
      >
        <BlurView
          intensity={25}
          tint={theme.mode === "dark" ? "dark" : "light"}
          style={styles.inner}
        >
          <View style={styles.inputRow}>
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
          </View>

          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              onSend();
            }}
            style={[styles.sendBtn, { backgroundColor: theme.primary }]}
          >
            <MaterialIcons name="send" size={20} color="#000" />
          </Pressable>
        </BlurView>
      </AppCard>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: Platform.OS === "ios" ? 24 : 12,
    borderRadius: 28,
    padding: 5,
    overflow: "hidden",
  },

  inner: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  textArea: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    fontSize: 15,
  },

  sendBtn: {
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatComposer;
