import { Text, Pressable } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";

type Props = {
  rec: any;
  onPress: () => void;
  onDelete: () => void;
  onOpen: (ref: SwipeableMethods) => void;
};

function RightAction(
  progress: SharedValue<number>,
  dragX: SharedValue<number>,
  onDelete: () => void,
) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value + 72 }],
  }));

  return (
    <Reanimated.View
      style={animatedStyle}
      className="flex-row items-center justify-end pr-4"
    >
      <Pressable
        onPress={onDelete}
        className="h-14 w-14 rounded-full bg-red-500/90 justify-center items-center"
      >
        <Ionicons name="trash-outline" size={22} color="white" />
      </Pressable>
    </Reanimated.View>
  );
}

export default function RecordingCard({
  rec,
  onPress,
  onDelete,
  onOpen,
}: Props) {
  const swipeRef = useRef<SwipeableMethods>(null);

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      rightThreshold={48}
      friction={2}
      onSwipeableOpen={() => {
        if (swipeRef.current) {
          onOpen(swipeRef.current);
        }
      }}
      renderRightActions={(progress, dragX) =>
        RightAction(progress, dragX, onDelete)
      }
    >
      <Pressable
        onPress={onPress}
        className="
          bg-slate-900/80
          backdrop-blur
          p-4
          rounded-2xl
          mb-3
          border
          border-white/10
        "
      >
        <Text className="text-base font-medium text-text">
          {rec.name || "Recording"}
        </Text>
      </Pressable>
    </ReanimatedSwipeable>
  );
}
