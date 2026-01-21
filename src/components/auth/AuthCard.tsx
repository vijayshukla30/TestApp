import Animated, { FadeInDown } from "react-native-reanimated";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      className="w-full"
    >
      {children}
    </Animated.View>
  );
}
