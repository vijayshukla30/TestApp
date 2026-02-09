import { Text, Pressable, View, ActivityIndicator } from "react-native";
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
  onUpload?: () => void;
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
  onUpload,
  progress,
  isPlaying,
  isPaused,
}: Props) {
  const swipeRef = useRef<SwipeableMethods>(null);

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      renderRightActions={(p, d) => RightAction(p, d, onDelete)}
      onSwipeableOpen={() => swipeRef.current && onOpen(swipeRef.current)}
    >
      <Pressable
        onPress={onPress}
        className="bg-slate-900 p-4 rounded-2xl mb-3"
      >
        <View className="flex-row justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-white font-medium" numberOfLines={1}>
              {rec.name}
            </Text>

            <Text className="text-white/50 text-xs mt-1">
              {formatDate(rec.createdAt)} · {formatTime(rec.createdAt)} ·{" "}
              {formatDuration(rec.duration)}
            </Text>

            {rec.uploadStatus === "UPLOADING" && (
              <MiniWaveform progress={rec.progress ?? 0} />
            )}

            {rec.uploadStatus === "PENDING" && (
              <Pressable onPress={onUpload} className="mt-2">
                <Text className="text-blue-400 text-xs">Upload</Text>
              </Pressable>
            )}

            {rec.uploadStatus === "FAILED" && (
              <Pressable onPress={onUpload} className="mt-2">
                <Text className="text-red-400 text-xs">Retry upload</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            disabled={rec.uploadStatus !== "UPLOADED"}
            onPress={onPlay}
            className="h-10 w-10 rounded-full bg-green-500 items-center justify-center"
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
