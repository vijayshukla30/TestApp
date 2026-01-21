import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { MicWaveform } from "./MicWaveform";
import { colors } from "../../theme/colors";

type Props = {
  recording: Audio.Recording | null;
  thinking: boolean;
  onToggle: () => void;
};

const MicSection = ({ recording, thinking, onToggle }: Props) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.sequence([
          Animated.spring(pulseAnim, {
            toValue: 1.15,
            useNativeDriver: true,
          }),
          Animated.spring(pulseAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [recording]);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={onToggle}
          hitSlop={20}
          className="w-[140px] h-[140px] rounded-full items-center justify-center shadow-2xl"
          style={{
            backgroundColor: recording ? "#EF4444" : colors.primary,
          }}
        >
          <MaterialIcons name="mic" size={56} color="#000" />
        </Pressable>
      </Animated.View>

      <Text className="mt-4 text-[15px] opacity-85 text-subText">
        {recording ? "Listening…" : thinking ? "Thinking…" : "Tap and speak"}
      </Text>

      {recording && <MicWaveform active color={colors.primary} />}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    elevation: 30,
    shadowOpacity: 0.4,
    shadowRadius: 40,
  },
  status: {
    marginTop: 16,
    fontSize: 15,
    opacity: 0.85,
  },
});

export default MicSection;
