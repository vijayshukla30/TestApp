import { Pressable, Image, Text, View } from "react-native";
import { getPlatformImage } from "../../utils/platform";
import { Agent } from "../../types/agent";

type Props = {
  agent: Agent;
  onOpenDetail: () => void;
};

export default function AgentCard({ agent, onOpenDetail }: Props) {
  return (
    <Pressable onPress={onOpenDetail} className="active:opacity-75">
      <View
        className={`
      items-center py-7 px-4      
      rounded-2xl 
      border border-border dark:border-dark-border
      bg-surface dark:bg-dark-surface
      shadow-sm dark:shadow-md     
      transition-all duration-200 
    `}
      >
        <Image
          source={getPlatformImage(agent.platform?.type)}
          className="w-14 h-14 mb-5"
          resizeMode="contain"
        />
        <Text
          className={`
        text-text dark:text-dark-text 
        text-lg font-semibold        // font-semibold often looks better than bold at this size
        text-center
      `}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {agent.agentName}
        </Text>
      </View>
    </Pressable>
  );
}
