import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  Animated,
  Pressable,
  PanResponder,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../hooks/useTheme";
import AnimatedBubble from "./AnimatedBubble";
import ThinkingDots from "./ThinkingDots";
type Props = {
  visible: boolean;
  messages: any[];
  thinking: boolean;
  onClose: () => void;
};
const HistoryModal = ({ visible, messages, thinking, onClose }: Props) => {
  const { theme } = useTheme();
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
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <BlurView
            intensity={25}
            tint={theme.mode === "dark" ? "dark" : "light"}
            style={[
              styles.header,
              {
                paddingTop: insets.top, // 👈 THIS IS THE REAL FIX
                height: 56 + insets.top,
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.text }]}>
              Conversation
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={theme.text} />
            </Pressable>
          </BlurView>

          <Animated.View
            style={{ flex: 1, transform: [{ translateY: panY }] }}
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
              renderItem={({ item }) => (
                <AnimatedBubble
                  style={[
                    styles.bubble,
                    item.role === "user" ? styles.userBubble : styles.botBubble,
                    {
                      backgroundColor:
                        item.role === "user" ? theme.primary : theme.surface,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        item.role === "user" ? theme.background : theme.text,
                    }}
                  >
                    {item.content}
                  </Text>
                </AnimatedBubble>
              )}
              ListFooterComponent={
                thinking ? <ThinkingDots color={theme.subText} /> : null
              }
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
  },

  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  botBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
});

export default HistoryModal;
