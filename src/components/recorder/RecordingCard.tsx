import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDate, formatTime, formatDuration } from "../../utils/format";

type Props = {
  rec: any;
  onPlay: () => void;
  onDelete: () => void;
  onScript?: () => void;
  onUpload?: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
};

export default function RecordingCard({
  rec,
  onPlay,
  onDelete,
  onScript,
  onUpload,
  isPlaying,
  isPaused,
  progress,
}: Props) {
  const percent = Math.round(progress * 100);
  return (
    <View className="bg-slate-900 rounded-xl p-4 mb-3 border border-white/10">
      <View className="flex-row items-start justify-between">
        <Text
          className="text-white font-medium text-sm flex-1 pr-3"
          numberOfLines={1}
        >
          {rec.name || "Recording"}
        </Text>

        <Text className="text-white/50 text-xs">
          {formatTime(rec.createdAt)}
        </Text>
      </View>

      <Text className="text-white/40 text-xs mt-1">
        {formatDate(rec.createdAt)} · {formatDuration(rec.duration)}
      </Text>

      <View className="h-px bg-white/10 my-3" />

      <View className="flex-row items-center justify-between px-4">
        {/* Play */}
        <Pressable
          onPress={onPlay}
          disabled={rec.uploadStatus !== "UPLOADED"}
          className={`items-center ${
            rec.uploadStatus !== "UPLOADED" ? "opacity-40" : ""
          }`}
        >
          <MaterialIcons
            name={isPlaying && !isPaused ? "pause" : "play-arrow"}
            size={26}
            color="#22c55e"
          />
        </Pressable>

        <Pressable
          onPress={onScript}
          disabled={rec.uploadStatus !== "UPLOADED"}
          className={`items-center ${
            rec.uploadStatus !== "UPLOADED" ? "opacity-40" : ""
          }`}
        >
          <MaterialIcons name="article" size={22} color="#60a5fa" />
        </Pressable>

        <Pressable onPress={onDelete} className="items-center">
          <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
        </Pressable>
      </View>

      {rec.uploadStatus === "UPLOADING" && (
        <View className="mt-3">
          <View className="h-2 bg-white/10 rounded-full overflow-hidden">
            <View
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </View>
          <Text className="text-xs text-white/50 mt-1 text-right">
            {percent}%
          </Text>
        </View>
      )}

      {/* ───── Upload actions ───── */}
      {rec.uploadStatus === "PENDING" && (
        <Pressable onPress={onUpload} className="mt-3">
          <Text className="text-blue-400 text-xs text-center">
            Upload recording
          </Text>
        </Pressable>
      )}

      {rec.uploadStatus === "FAILED" && (
        <Pressable onPress={onUpload} className="mt-3">
          <Text className="text-red-400 text-xs text-center">Retry upload</Text>
        </Pressable>
      )}
    </View>
  );
}
