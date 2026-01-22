import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  Animated,
  Pressable,
  PanResponder,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedBubble from "./AnimatedBubble";
import ThinkingDots from "./ThinkingDots";
import { useColorScheme } from "nativewind";
import ThemedIcon from "../ui/ThemedIcon";
type Props = {
  visible: boolean;
  messages: any[];
  thinking: boolean;
  onClose: () => void;
};
const HistoryModal = ({ visible, messages, thinking, onClose }: Props) => {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 12,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          onClose();
          panY.setValue(0);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-background dark:bg-dark-background">
          <BlurView
            intensity={isDark ? 40 : 25}
            tint={isDark ? "dark" : "light"}
            className="
              absolute left-0 right-0 z-10 
              flex-row items-center justify-between 
              px-4 
              border-b border-border dark:border-dark-border
            "
            style={{
              paddingTop: insets.top,
              height: 56 + insets.top,
            }}
          >
            <Text className="text-text dark:text-dark-text text-base font-semibold">
              Conversation
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              className="active:opacity-70"
            >
              <ThemedIcon name="close" size={24} />
            </Pressable>
          </BlurView>

          <Animated.View
            className="flex-1"
            style={{ transform: [{ translateY: panY }] }}
            {...panResponder.panHandlers}
          >
            <FlatList
              data={messages}
              keyExtractor={(i) => i.id}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingTop: 56 + insets.top + 16,
                paddingHorizontal: 16,
                paddingBottom: 24,
              }}
              renderItem={({ item }) => {
                const isUser = item.role === "user";
                return (
                  <AnimatedBubble
                    style={{
                      alignSelf: isUser ? "flex-end" : "flex-start",
                      maxWidth: "78%",
                      padding: 12,
                      borderRadius: 16,
                      marginVertical: 6,
                      ...(isUser
                        ? { borderBottomRightRadius: 4 }
                        : { borderBottomLeftRadius: 4 }),
                    }}
                  >
                    <Text
                      className={`
                        text-[15px] leading-6
                        ${
                          isUser
                            ? "text-white dark:text-black"
                            : "text-text dark:text-dark-text"
                        }
                      `}
                    >
                      {item.content}
                    </Text>
                  </AnimatedBubble>
                );
              }}
              ListFooterComponent={
                <ThinkingDots
                  active={thinking}
                  className="self-start ml-4 mt-3"
                />
              }
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HistoryModal;
