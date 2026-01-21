import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
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

  const isListening = !!recording;

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={onToggle}
          hitSlop={20}
          className="w-[140px] h-[140px] rounded-full items-center justify-center shadow-2xl"
          style={{
            backgroundColor: isListening ? colors.primary : "#EF4444",
          }}
        >
          <MaterialIcons
            name={isListening ? "mic" : "mic-off"}
            size={56}
            color="#000"
          />
        </Pressable>
      </Animated.View>

      <Text className="mt-4 text-[15px] opacity-85 text-subText">
        {isListening ? "Listening…" : thinking ? "Thinking…" : "Tap and speak"}
      </Text>

      {isListening && <MicWaveform active color={colors.primary} />}
    </View>
  );
};

export default MicSection;
