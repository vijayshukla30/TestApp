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
      <View
        className="relative rounded-2xl p-3
          bg-surface dark:bg-dark-surface
          border border-border dark:border-dark-border
          shadow-sm dark:shadow-md"
      >
        <Pressable
          onPress={onOpenHistory}
          className="absolute top-2 right-2
            w-8 h-8 rounded-full
            items-center justify-center
            bg-black/10 dark:bg-white/10
            active:opacity-75"
        >
          <MaterialIcons
            name="history"
            size={18}
            className="text-subText dark:text-dark-subText"
          />
        </Pressable>

        {preview.map((m) => {
          const isUser = m.role === "user";
          return (
            <View
              key={m.id}
              className={`
                my-1 px-3 py-1.5 rounded-2xl max-w-[85%]
                ${
                  isUser
                    ? "self-end bg-primary dark:bg-dark-primary"
                    : "self-start bg-surface-secondary dark:bg-dark-surface/70"
                }
              `}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={`
                  text-sm leading-5
                  ${isUser ? "text-black dark:text-black" : "text-text dark:text-dark-text"}
                `}
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
