import { Pressable, Image, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getPlatformImage } from "../../utils/platform";
import { Agent } from "../../types/agent";
import Card from "../ui/Card";

type Props = {
  agent: Agent;
  onOpenDetail: () => void;
  onUseNow: () => void;
  onCall?: () => void;
};

export default function HomeAgentCard({
  agent,
  onOpenDetail,
  onUseNow,
  onCall,
}: Props) {
  return (
    <Card className="p-6 items-center">
      {agent.phoneId && (
        <Pressable
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/10 items-center justify-center"
          onPress={onCall}
          android_ripple={{ color: "#ffffff20", radius: 18 }}
        >
          <MaterialIcons name="call" size={18} color="#8B9CFF" />
        </Pressable>
      )}

      {/* Settings icon – TOP RIGHT */}
      <Pressable
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 items-center justify-center"
        onPress={onOpenDetail}
        android_ripple={{ color: "#ffffff20", radius: 18 }}
      >
        <MaterialIcons name="settings" size={18} color="#9CA3AF" />
      </Pressable>

      {/* Platform Icon */}
      <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center mb-4">
        <Image
          source={getPlatformImage(agent.platform?.type)}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </View>

      {/* Agent name */}
      <Text className="text-text text-lg font-bold mb-4" numberOfLines={1}>
        {agent.agentName}
      </Text>

      {/* CTA */}
      <Pressable
        className="flex-row items-center gap-1 bg-primary px-4 py-2 rounded-xl"
        onPress={onUseNow}
      >
        <MaterialIcons name="play-arrow" size={18} color="#000" />
        <Text className="text-black font-bold text-sm">Use Now</Text>
      </Pressable>
    </Card>
  );
}
