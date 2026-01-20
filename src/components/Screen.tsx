// components/Screen.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import useTheme from "../hooks/useTheme";

export default function Screen({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: isDark ? "#0B1020" : theme.background },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});
