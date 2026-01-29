import React, { createContext, useState, useCallback } from "react";
import { View, Text, Animated } from "react-native";

type UIContextType = {
  showMessage: (message: string) => void;
};

export const UIContext = createContext<UIContextType>({
  showMessage: () => {},
});

/* ---------- external trigger ---------- */

let externalShowMessage: ((msg: string) => void) | null = null;

export const setExternalShowMessage = (fn: (msg: string) => void) => {
  externalShowMessage = fn;
};

export const showGlobalMessage = (message: string) => {
  externalShowMessage?.(message);
};

/* ---------- provider ---------- */

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  const hide = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setMessage(null));
  };

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(hide, 3000);
  }, []);

  setExternalShowMessage(showMessage);

  return (
    <UIContext.Provider value={{ showMessage }}>
      {children}

      {message && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 32,
            opacity,
            transform: [{ translateY }],
          }}
          className="bg-zinc-900 rounded-xl px-4 py-3"
        >
          <Text className="text-white text-sm text-center">{message}</Text>
        </Animated.View>
      )}
    </UIContext.Provider>
  );
}
