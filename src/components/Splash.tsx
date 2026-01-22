import { Text, Image } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";
import { useColorScheme } from "nativewind";

export default function Splash() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      className={`
        flex-1 items-center justify-center
        bg-background dark:bg-dark-background
      `}
    >
      <Animated.Image
        entering={ZoomIn.duration(600).springify().delay(200)}
        source={require("../../assets/logo.png")}
        className="w-24 h-24 mb-3"
        resizeMode="contain"
      />

      <Animated.Text
        entering={FadeIn.duration(600).delay(400)}
        className={`
         text-text dark:text-dark-text text-3xl font-bold tracking-widest
        `}
      >
        gennie
      </Animated.Text>
    </Animated.View>
  );
}
