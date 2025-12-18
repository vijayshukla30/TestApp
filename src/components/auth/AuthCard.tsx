import Animated, { FadeInDown } from "react-native-reanimated";
import { StyleSheet } from "react-native";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.container}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
