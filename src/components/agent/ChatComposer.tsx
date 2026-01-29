import React, { useState, useRef } from "react";
import { View, Pressable, TextInput, Text, Modal } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { AttachmentSheet } from "./AttachmentSheet";
import { colors } from "../../theme/colors";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
};

export default function ChatComposer({ value, onChange, onSend }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [showAttachments, setShowAttachments] = useState(false);

  return (
    <View className="gap-3">
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="rounded-3xl p-1 bg-surface border border-border"
      >
        <BlurView
          intensity={25}
          tint="dark"
          className="flex-row items-start gap-2 px-3 py-2 rounded-2xl"
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            placeholder="Type or speak…"
            placeholderTextColor={colors.subText}
            multiline
            textAlign={value ? "left" : "center"}
            textAlignVertical="top"
            className="flex-1 h-14 rounded-xl text-text text-[15px] px-3"
          />
        </BlurView>
      </Pressable>

      <View className="flex-row gap-3">
        <Pressable
          onPress={onSend}
          className="flex-1 h-11 rounded-xl flex-row items-center justify-center gap-2 bg-primary"
        >
          <MaterialIcons name="send" size={18} color="#000" />
          <Text className="text-black text-[15px] font-semibold">Send</Text>
        </Pressable>

        <Pressable
          onPress={() => setShowAttachments(true)}
          className="w-11 h-11 rounded-xl items-center justify-center bg-surface shadow-md"
        >
          <MaterialIcons name="photo-camera" size={22} color={colors.subText} />
        </Pressable>
      </View>
      <AttachmentSheet
        visible={showAttachments}
        onClose={() => setShowAttachments(false)}
      />
    </View>
  );
}
