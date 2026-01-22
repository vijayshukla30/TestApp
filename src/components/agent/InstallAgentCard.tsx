import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../ui/Card";
import ThemedIcon from "../ui/ThemedIcon";

type Props = {
  onPress: () => void;
};

export default function InstallAgentCard({ onPress }: Props) {
  return (
    <Card
      className="p-6 items-center 
        border-dashed border-border dark:border-dark-border
        min-h-[200px]               // ← force minimum height to match other cards
        justify-between"
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        className="items-center active:opacity-75 w-full"
      >
        <View
          className="
            w-16 h-16 rounded-full 
            bg-white/10 dark:bg-white/8 
            items-center justify-center 
            mb-5
            border border-border/20 dark:border-dark-border/30
          "
        >
          <ThemedIcon name="add" size={32} />
        </View>

        <Text
          className="
            text-text dark:text-dark-text 
            font-bold text-base 
            mb-3 
            text-center 
            w-full
          "
        >
          Install
        </Text>

        <Text
          className="
           text-subText dark:text-dark-subText 
            text-xs text-center 
            leading-4
          "
        >
          Browse available assistants
        </Text>
      </Pressable>
    </Card>
  );
}
