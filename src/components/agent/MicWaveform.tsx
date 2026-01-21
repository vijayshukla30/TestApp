import { Animated, View, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export function MicWaveform({ active, color }: any) {
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
          style={{
            width: 4,
            height: a, // 👈 animated
            borderRadius: 2,
            backgroundColor: color, // 👈 dynamic
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 6,
    alignSelf: "center",
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
});
