import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../ui/Card";

type Props = {
  onPress: () => void;
};

export default function InstallAgentCard({ onPress }: Props) {
  return (
    <Card className="p-6 items-center border-dashed">
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        className="items-center"
      >
        <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center mb-6">
          <MaterialIcons name="add" size={32} color="#8B9CFF" />
        </View>

        <Text className="text-text font-bold text-base mb-3">
          Install Assistant
        </Text>

        <Text className="text-subText text-xs text-center">
          Browse available assistants
        </Text>
      </Pressable>
    </Card>
  );
}
