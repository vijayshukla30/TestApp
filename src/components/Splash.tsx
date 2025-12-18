import { View, Text, StyleSheet, Image } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function Splash() {
  useEffect(() => {
    // Prevent auto hide until we decide
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>gennie</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  text: {
    color: "#E5E7EB",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
