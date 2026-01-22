import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

const AnimatedBubble = ({ children, style, isUser = false }: any) => {
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
    <Animated.View
      style={[style, { transform: [{ scale }], opacity }]}
      className={`
                my-1 px-3 py-1.5 rounded-2xl max-w-[85%]
                ${
                  isUser
                    ? "self-end bg-primary dark:bg-dark-primary"
                    : "self-start bg-surface-secondary dark:bg-dark-surface/70"
                }
              `}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedBubble;
