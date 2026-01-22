import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  className = "",
}: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        w-full rounded-xl 
        bg-primary dark:bg-dark-primary 
        py-3.5 px-6 
        items-center justify-center 
        flex-row gap-2
        active:opacity-90 
        shadow-sm dark:shadow-md
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator color={isDark ? "#000000" : "#000000"} />
      ) : (
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="check" size={18} color="#000" />
          <Text className="text-black dark:text-black font-semibold text-base">
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
