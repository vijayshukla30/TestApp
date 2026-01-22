import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedIcon from "./ThemedIcon";

export default function ErrorText({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <View className="flex-row items-center gap-1.5 mt-1 mb-2">
      <ThemedIcon name="error-outline" size={16} />
      <Text className="text-xs text-red-500 dark:text-red-400 font-medium">
        {message}
      </Text>
    </View>
  );
}
