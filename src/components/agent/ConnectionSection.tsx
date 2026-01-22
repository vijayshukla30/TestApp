import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ThemedIcon from "../ui/ThemedIcon";

type Props = {
  onConnect: () => void;
  onDisconnect: () => void;
  installed: boolean;
  loading: boolean;
};

export default function ConnectionSection({
  onConnect,
  onDisconnect,
  installed,
  loading,
}: Props) {
  return (
    <View
      className="items-center rounded-2xl 
        border border-border dark:border-dark-border
        bg-surface dark:bg-dark-surface 
        px-5 py-7 mb-6
        shadow-sm dark:shadow-md"
    >
      <View
        className="w-[72px] h-[72px] rounded-full 
          items-center justify-center mb-3 
          bg-primary/15 dark:bg-dark-primary/20"
      >
        <ThemedIcon name="link" size={36} />
      </View>

      <Text className="text-text dark:text-dark-text text-base font-semibold">
        Platform Connection
      </Text>

      <Text className="text-subText dark:text-dark-subText text-xs text-center mt-1.5 mb-5">
        Connect your platform to enable tools and automation.
      </Text>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          installed ? onDisconnect() : onConnect();
        }}
        disabled={loading}
        className={`
          min-w-[180px] h-11 rounded-xl 
          items-center justify-center 
          flex-row gap-2
          ${
            installed
              ? "bg-red-500 active:bg-red-600 dark:bg-red-600 dark:active:bg-red-700"
              : "bg-primary dark:bg-dark-primary active:bg-primary/90 dark:active:bg-dark-primary/90"
          }
          ${loading ? "opacity-70" : ""}
        `}
      >
        {loading ? (
          <ActivityIndicator color={installed ? "#ffffff" : "#000000"} />
        ) : (
          <>
            <ThemedIcon
              name={installed ? "link-off" : "link"}
              size={18}
              lightColor={installed ? "#6366F1" : "#8B9CFF"}
              darkColor={installed ? "#8B9CFF" : "#6366F1"}
            />
            <Text
              className={`
                font-semibold text-[15px]
                ${installed ? "text-white" : "text-black dark:text-black"}
              `}
            >
              {installed ? "Disconnect" : "Connect Platform"}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
