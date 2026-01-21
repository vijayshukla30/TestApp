import { View } from "react-native";

export default function AgentCardSkeleton() {
  return (
    <View className="flex-1 items-center py-5 rounded-2xl border border-white/10 bg-surface/60">
      <View className="w-11 h-11 rounded-full bg-gray-200 mb-3" />

      <View className="w-[70%] h-3 rounded-md bg-gray-200 mb-1.5" />

      <View className="w-[50%] h-2.5 rounded-md bg-gray-200" />
    </View>
  );
}
