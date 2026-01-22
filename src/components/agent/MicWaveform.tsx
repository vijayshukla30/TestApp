import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";
import { useColorScheme } from "nativewind";

export function MicWaveform({ active, color }: any) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const bars = Array.from({ length: 5 });
  const anims = useRef(bars.map(() => new Animated.Value(4))).current;

  useEffect(() => {
    if (!active) return;

    const animations = anims.map((a) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(a, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(a, {
            toValue: 6,
            duration: 300,
            useNativeDriver: false,
          }),
        ]),
      ),
    );

    animations.forEach((a) => a.start());

    return () => {
      anims.forEach((a) => a.stopAnimation());
    };
  }, [active]);

  if (!active) return null;

  return (
    <View className="flex-row gap-1 mb-1 self-center">
      {anims.map((a, i) => (
        <Animated.View
          key={i}
          className={`
        w-1 h-8 rounded-sm
        ${
          active
            ? "bg-primary dark:bg-dark-primary"
            : "bg-subText dark:bg-dark-subText"
        }
      `}
          style={{ height: a }}
        />
      ))}
    </View>
  );
}
