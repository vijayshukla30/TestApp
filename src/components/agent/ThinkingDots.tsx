import React, { useRef, useEffect } from "react";
import { Animated, View } from "react-native";

const ThinkingDots = ({ color }: any) => {
  const dots = [
    useRef(new Animated.Value(0.2)).current,
    useRef(new Animated.Value(0.2)).current,
    useRef(new Animated.Value(0.2)).current,
  ];

  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(d, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(d, {
            toValue: 0.2,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => dots.forEach((d) => d.stopAnimation());
  }, []);
  return (
    <View style={{ flexDirection: "row", gap: 6, padding: 6 }}>
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: color,
            opacity: d,
          }}
        />
      ))}
    </View>
  );
};

export default ThinkingDots;
