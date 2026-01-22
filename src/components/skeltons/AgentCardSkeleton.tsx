import { View } from "react-native";

export default function AgentCardSkeleton() {
  return (
    <View
      className="
    flex-1 items-center py-6 
    rounded-2xl 
    border border-border/30 dark:border-dark-border/40
    bg-surface/80 dark:bg-dark-surface/70
  "
    >
      <View className="w-12 h-12 rounded-full bg-surface-secondary dark:bg-dark-surface/60 mb-5" />

      <View className="w-4/5 h-4 rounded-full bg-surface-secondary dark:bg-dark-surface/50 mb-2.5" />

      <View className="w-3/5 h-3.5 rounded-full bg-surface-secondary dark:bg-dark-surface/40" />
    </View>
  );
}
