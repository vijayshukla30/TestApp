import { View, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";

export default function AuthSkeleton() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="flex-1 items-center justify-center py-16">
      <ActivityIndicator
        size="large"
        className="text-primary dark:text-dark-primary"
      />
    </View>
  );
}
