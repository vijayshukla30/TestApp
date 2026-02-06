import { Text, Pressable, View } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { formatDate, formatDuration, formatTime } from "../../utils/format";
import MiniWaveform from "./MiniWaveform";

type Props = {
  rec: any;
  onPress: () => void;
  onDelete: () => void;
  onOpen: (ref: SwipeableMethods) => void;
  onPlay: () => void;
  progress: number;
  isPlaying: boolean;
  isPaused: boolean;
};

function RightAction(
  progress: SharedValue<number>,
  dragX: SharedValue<number>,
  onDelete: () => void,
) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value + 72 }],
  }));

  return (
    <Reanimated.View
      style={animatedStyle}
      className="flex-row items-center justify-end pr-4"
    >
      <Pressable
        onPress={onDelete}
        className="h-14 w-14 rounded-full bg-red-500/90 justify-center items-center"
      >
        <MaterialIcons name="delete-outline" size={22} color="white" />
      </Pressable>
    </Reanimated.View>
  );
}

export default function RecordingCard({
  rec,
  onPress,
  onDelete,
  onOpen,
  onPlay,
  progress,
  isPlaying,
  isPaused,
}: Props) {
  const swipeRef = useRef<SwipeableMethods>(null);

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      rightThreshold={48}
      friction={2}
      onSwipeableOpen={() => {
        if (swipeRef.current) {
          onOpen(swipeRef.current);
        }
      }}
      renderRightActions={(progress, dragX) =>
        RightAction(progress, dragX, onDelete)
      }
    >
      <Pressable
        onPress={onPress}
        className="
          bg-slate-900/80
          backdrop-blur
          p-4
          rounded-2xl
          mb-3
          border
          border-white/10
        "
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text
              className="text-white text-[15px] font-medium"
              numberOfLines={1}
            >
              {rec.name || "Recording"}
            </Text>

            <Text className="text-white/50 text-[13px] mt-1">
              {formatDate(rec.createdAt)} · {formatTime(rec.createdAt)} ·{" "}
              {formatDuration(rec.duration)}
            </Text>
            {progress > 0 && <MiniWaveform progress={progress} />}
          </View>
          <Pressable
            onPress={onPlay}
            hitSlop={12}
            className="
            h-10 w-10
            rounded-full
            bg-green-500/90
            items-center
            justify-center
          "
          >
            <MaterialIcons
              name={isPlaying && !isPaused ? "pause" : "play-arrow"}
              size={22}
              color="#000"
            />
          </Pressable>
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
}
