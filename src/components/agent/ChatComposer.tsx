import React, { useState, useRef } from "react";
import {
  View,
  Pressable,
  TextInput,
  Text,
  Modal,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { AttachmentSheet } from "./AttachmentSheet";
import { useColorScheme } from "nativewind";
import ThemedIcon from "../ui/ThemedIcon";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
};

export default function ChatComposer({ value, onChange, onSend }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [showAttachments, setShowAttachments] = useState(false);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={`
        gap-4 pb-4 ${Platform.OS === "android" ? "pb-6" : "pb-4"} 
        bg-background dark:bg-dark-background
      `}
    >
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="
      rounded-3xl p-1 
      bg-surface dark:bg-dark-surface 
      border border-border dark:border-dark-border
    "
      >
        <BlurView
          intensity={25}
          tint={isDark ? "dark" : "light"}
          className="
        flex-row items-start gap-2 
        px-3 py-2 
        rounded-2xl 
        bg-surface/70 dark:bg-dark-surface/70
      "
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            placeholder="Type or speak…"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            multiline
            textAlign={value ? "left" : "center"}
            textAlignVertical="top"
            className="
          flex-1 h-14 rounded-xl 
          text-text dark:text-dark-text 
          text-[15px] 
          px-2 py-1
        "
          />
        </BlurView>
      </Pressable>

      <View
        className={`
          flex-row gap-3 
          px-2 
          ${Platform.OS === "android" ? "pb-8" : "pb-4"}  // extra space on Android
          ${Platform.OS === "ios" ? "pb-6" : ""}          // iOS home indicator safe area
        `}
      >
        <Pressable
          onPress={onSend}
          className="
        flex-1 h-11 rounded-xl 
        flex-row items-center justify-center gap-2 
        bg-primary dark:bg-dark-primary
        active:opacity-85
      "
        >
          <ThemedIcon name="send" size={18} />
          <Text className="text-black dark:text-black text-[15px] font-semibold">
            Send
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowAttachments(true)}
          className="
        w-11 h-11 rounded-xl 
        items-center justify-center 
        bg-surface dark:bg-dark-surface 
        border border-border/30 dark:border-dark-border/40
        shadow-md dark:shadow-lg
        active:opacity-75
      "
        >
          <ThemedIcon name="photo-camera" size={22} />
        </Pressable>
      </View>
      <AttachmentSheet
        visible={showAttachments}
        onClose={() => setShowAttachments(false)}
      />
    </View>
  );
}
