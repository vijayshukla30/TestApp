import { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { MicWaveform } from "./MicWaveform";
import { colors } from "../../theme/colors";

type Props = {
  recording: Audio.Recording | null;
  isPaused: boolean;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
};

const RecordMicSection = ({
  recording,
  onStop,
  isPaused,
  onPause,
  onResume,
}: Props) => {
  const [seconds, setSeconds] = useState(0);
  const isListening = !!recording;

  useEffect(() => {
    if (!isListening || isPaused) return;

    const t = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(t);
  }, [isListening, isPaused]);

  useEffect(() => {
    if (!isListening) setSeconds(0);
  }, [isListening]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const handleStop = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStop();
  };

  const handlePauseResume = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isPaused ? onResume() : onPause();
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center">
        <View className="scale-[2.2] opacity-90">
          <MicWaveform
            active={isListening}
            color={isPaused ? "#64748b" : colors.primary}
          />
        </View>
        <Text className="mt-10 text-[28px] font-semibold text-white">
          {mm}:{ss}
        </Text>

        <Text className="mt-2 text-white/50 text-sm">
          {isPaused ? "Paused" : "Recording…"}
        </Text>
      </View>

      <View className="px-6 pb-8">
        <View
          className="
          flex-row items-center justify-center gap-12
          rounded-3xl
          py-6
          shadow-2xl
        "
        >
          <Pressable
            onPress={handlePauseResume}
            hitSlop={20}
            className={`
              h-16 w-16 rounded-full items-center justify-center
              ${isPaused ? "bg-green-500" : "bg-yellow-500"}
            `}
          >
            <MaterialIcons
              name={isPaused ? "play-arrow" : "pause"}
              size={34}
              color="#000"
            />
          </Pressable>

          <Pressable
            onPress={handleStop}
            className="h-14 w-14 rounded-full bg-red-500 items-center justify-center"
          >
            <MaterialIcons name="stop" size={28} color="#000" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default RecordMicSection;
