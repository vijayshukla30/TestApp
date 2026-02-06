import { View } from "react-native";

type Props = {
  progress: number; // 0 → 1
};

export default function MiniWaveform({ progress }: Props) {
  const bars = 20;
  const activeBars = Math.floor(progress * bars);

  return (
    <View className="flex-row gap-0.5 mt-2">
      {Array.from({ length: bars }).map((_, i) => (
        <View
          key={i}
          className={`h-2 w-2 rounded-sm ${
            i < activeBars ? "bg-green-500" : "bg-white/20"
          }`}
        />
      ))}
    </View>
  );
}
