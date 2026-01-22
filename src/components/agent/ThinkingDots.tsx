import { useColorScheme } from "nativewind";
import React, { useRef, useEffect } from "react";
import { Animated, View } from "react-native";

type Props = {
  color?: string; // optional override
  active?: boolean; // optional: only animate when active
  className?: string;
};

const ThinkingDots = ({
  color: propColor,
  active = true,
  className = "",
}: Props) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const defaultColor = propColor ?? (isDark ? "#9CA3AF" : "#6B7280");
  const dots = [
    useRef(new Animated.Value(0.2)).current,
    useRef(new Animated.Value(0.2)).current,
    useRef(new Animated.Value(0.2)).current,
  ];

  useEffect(() => {
    if (!active) {
      dots.forEach((dot) => dot.setValue(0.3));
      return;
    }

    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(d, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(d, {
            toValue: 0.3,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => {
      anims.forEach((anim) => anim.stop());
      dots.forEach((dot) => dot.stopAnimation());
    };
  }, [active]);

  return (
    <View style={{ flexDirection: "row", gap: 6, padding: 6 }}>
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: defaultColor,
            opacity: d,
          }}
        />
      ))}
    </View>
  );
};

export default ThinkingDots;
