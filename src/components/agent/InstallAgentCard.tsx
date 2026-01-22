import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../ui/Card";

type Props = {
  onPress: () => void;
};

export default function InstallAgentCard({ onPress }: Props) {
  return (
    <Card
      className="p-6 items-center 
        border-dashed 
        border-border dark:border-dark-border"
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        className="
          items-center 
          active:opacity-75
        "
      >
        <View
          className="
            w-16 h-16 rounded-full 
    bg-white/10 dark:bg-primary/20 
    items-center justify-center 
    mb-6
    border border-border/20 dark:border-dark-primary/30
          "
        >
          <MaterialIcons
            name="add"
            size={32}
            className="text-primary dark:text-dark-primary"
          />
        </View>

        <Text
          className="
            text-text dark:text-dark-text 
            font-bold text-base 
            mb-3
          "
        >
          Install Assistant
        </Text>

        <Text
          className="
            text-subText dark:text-dark-subText 
            text-xs text-center
          "
        >
          Browse available assistants
        </Text>
      </Pressable>
    </Card>
  );
}
