import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import useTheme from "../hooks/useTheme";

type Props = {
  children: React.ReactNode;
  center?: boolean; // ✅ for auth
};

export default function Screen({ children, center }: Props) {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";

  const Content = (
    <SafeAreaView
      style={[styles.safe, !isDark && { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.container,
            center && styles.centerContainer,
            center && { paddingBottom: 0 },
          ]}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  if (isDark) {
    return (
      <LinearGradient
        colors={["#0B1020", "#141A2E", "#0B1020"]}
        style={{ flex: 1 }}
      >
        {Content}
      </LinearGradient>
    );
  }

  return Content;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // ✅ TRUE vertical centering
  centerContainer: {
    justifyContent: "center",
    paddingTop: 0,
  },
});
