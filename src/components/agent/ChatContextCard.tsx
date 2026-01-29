import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

type Props = {
  messages: any[];
  onOpenHistory: () => void;
};

export default function ChatContextDock({ messages, onOpenHistory }: Props) {
  const preview = messages.slice(-3);

  if (!preview.length) return null;

  return (
    <View className="px-0.5 mb-2">
      <View className="relative rounded-2xl p-3 border border-white/10 bg-surface">
        <Pressable
          onPress={onOpenHistory}
          className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center bg-black/30"
        >
          <MaterialIcons name="history" size={18} color={colors.subText} />
        </Pressable>

        {preview.map((m) => {
          const isUser = m.role === "user";
          return (
            <View
              key={m.id}
              className="my-1 px-3 py-1.5 rounded-2xl max-w-[85%]"
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                backgroundColor: isUser
                  ? colors.primary
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <Text
                numberOfLines={1}
                className="text-sm"
                style={{
                  color: isUser ? colors.background : colors.text,
                }}
              >
                {m.content}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
