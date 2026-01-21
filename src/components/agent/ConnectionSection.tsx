import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

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
    <View className="items-center rounded-2xl border border-white/10 bg-surface px-5 py-7 mb-6">
      <View className="w-[72px] h-[72px] rounded-full items-center justify-center mb-3 bg-primary/20">
        <MaterialIcons name="link" size={36} color={colors.primary} />
      </View>

      <Text className="text-text text-base font-semibold">
        Platform Connection
      </Text>

      <Text className="text-subText text-xs text-center mt-1.5 mb-4">
        Connect your platform to enable tools and automation.
      </Text>

      <Pressable
        onPress={installed ? onDisconnect : onConnect}
        className={`min-w-[180px] h-11 rounded-xl items-center justify-center ${
          installed ? "bg-red-500" : "bg-primary"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-black font-semibold text-[15px]">
            {installed ? "Disconnect" : "Connect Platform"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
