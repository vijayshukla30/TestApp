import { Pressable, Image, Text, View } from "react-native";
import { getPlatformImage } from "../../utils/platform";
import { Agent } from "../../types/agent";

type Props = {
  agent: Agent;
  onOpenDetail: () => void;
};

export default function AgentCard({ agent, onOpenDetail }: Props) {
  return (
    <Pressable onPress={onOpenDetail}>
      <View className="items-center py-7 rounded-2xl border border-white/10 bg-surface">
        <Image
          source={getPlatformImage(agent.platform?.type)}
          className="w-14 h-14 mb-4"
          resizeMode="contain"
        />
        <Text
          className="text-text text-lg font-bold text-center"
          numberOfLines={1}
        >
          {agent.agentName}
        </Text>
      </View>
    </Pressable>
  );
}
