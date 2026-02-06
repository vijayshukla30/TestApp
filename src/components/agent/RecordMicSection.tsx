import { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { MicWaveform } from "./MicWaveform";
import { colors } from "../../theme/colors";

type Props = {
  recording: Audio.Recording | null;
  onStop: () => void;
};

const RecordMicSection = ({ recording, onStop }: Props) => {
  const [seconds, setSeconds] = useState(0);

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
  }, [isListening]);

  useEffect(() => {
    if (!isListening) return;

    setSeconds(0);
    const t = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(t);
  }, [isListening]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const handleStop = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStop();
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={handleStop}
          hitSlop={20}
          className="w-[140px] h-[140px] rounded-full items-center justify-center shadow-2xl"
          style={{
            backgroundColor: isListening ? colors.primary : "#EF4444",
          }}
        >
          <MaterialIcons name="stop" size={56} color="#000" />
        </Pressable>
      </Animated.View>

      <Text className="mt-4 text-[18px] text-white opacity-90">
        {mm}:{ss}
      </Text>

      {isListening && <MicWaveform active color={colors.primary} />}
    </View>
  );
};

export default RecordMicSection;
