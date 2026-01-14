import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

const AnimatedBubble = ({ children, style }: any) => {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 14,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[style, { transform: [{ scale }], opacity }]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedBubble;
