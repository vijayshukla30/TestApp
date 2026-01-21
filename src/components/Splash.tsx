import { Text, Image } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function Splash() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      className="flex-1 items-center justify-center bg-[#0B1020]"
    >
      <Image
        source={require("../../assets/logo.png")}
        className="w-24 h-24 mb-3"
        resizeMode="contain"
      />

      <Text className="text-gray-200 text-xl font-semibold tracking-wide">
        gennie
      </Text>
    </Animated.View>
  );
}
