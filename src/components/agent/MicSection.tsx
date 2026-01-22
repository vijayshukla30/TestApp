import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { MicWaveform } from "./MicWaveform";
import { useColorScheme } from "nativewind";
import ThemedIcon from "../ui/ThemedIcon";

type Props = {
  recording: Audio.Recording | null;
  thinking: boolean;
  onToggle: () => void;
};

const MicSection = ({ recording, thinking, onToggle }: Props) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isListening = !!recording;

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

  const handleToggle = async () => {
    if (thinking) return;

    // 🔔 Haptics
    if (isListening) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onToggle();
  };

  const micBgColor = isListening
    ? isDark
      ? "#8B9CFF" // dark-primary
      : "#6366F1" // primary (light)
    : isDark
      ? "#EF4444CC" // softer red in dark mode
      : "#EF4444";

  const iconColor = isDark ? "#000000" : "#000000";

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={handleToggle}
          disabled={thinking}
          hitSlop={20}
          className={`
            w-[140px] h-[140px] rounded-full 
            items-center justify-center 
            shadow-2xl dark:shadow-xl
            ${thinking ? "opacity-55" : "active:opacity-85"}
          `}
          style={{ backgroundColor: micBgColor }}
        >
          <ThemedIcon
            name={isListening ? "mic" : "mic-off"}
            size={56}
            lightColor={iconColor}
            darkColor={iconColor}
            style={{ opacity: thinking ? 0.65 : 1 }}
          />
        </Pressable>
      </Animated.View>

      <Text
        className={`
          mt-5 text-[15px] font-medium
          text-subText dark:text-dark-subText
          ${thinking || isListening ? "opacity-90" : "opacity-75"}
        `}
      >
        {isListening ? "Listening…" : thinking ? "Thinking…" : "Tap and speak"}
      </Text>

      {isListening && (
        <MicWaveform
          active
          color={isDark ? "#8B9CFF" : "#6366F1"}
          className="mt-6"
        />
      )}
    </View>
  );
};

export default MicSection;
