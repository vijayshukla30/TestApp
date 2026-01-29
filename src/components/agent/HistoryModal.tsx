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
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedBubble from "./AnimatedBubble";
import ThinkingDots from "./ThinkingDots";
import { colors } from "../../theme/colors";
type Props = {
  visible: boolean;
  messages: any[];
  thinking: boolean;
  onClose: () => void;
};
const HistoryModal = ({ visible, messages, thinking, onClose }: Props) => {
  const insets = useSafeAreaInsets();
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
        <View className="flex-1 bg-background">
          <BlurView
            intensity={25}
            tint="dark"
            className="absolute left-0 right-0 z-10 flex-row items-center justify-between px-4 border-b border-white/10"
            style={{
              paddingTop: insets.top,
              height: 56 + insets.top,
            }}
          >
            <Text className="text-text text-base font-semibold">
              Conversation
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={colors.text} />
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
                      backgroundColor: isUser ? colors.primary : colors.surface,
                      ...(isUser
                        ? { borderBottomRightRadius: 4 }
                        : { borderBottomLeftRadius: 4 }),
                    }}
                  >
                    <Text
                      style={{
                        color: isUser ? colors.background : colors.text,
                      }}
                    >
                      {item.content}
                    </Text>
                  </AnimatedBubble>
                );
              }}
              ListFooterComponent={
                thinking ? <ThinkingDots color={colors.subText} /> : null
              }
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HistoryModal;
