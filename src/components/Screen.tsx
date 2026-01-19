import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import useTheme from "../hooks/useTheme";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  center?: boolean;
};

export default function Screen({ children, center, scroll = false }: Props) {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const insets = useSafeAreaInsets();

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        center && styles.centerContainer,
        { paddingTop: insets.top },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.container,
        center && styles.centerContainer,
        { paddingTop: insets.top },
      ]}
    >
      {children}
    </View>
  );

  const body = (
    <SafeAreaView
      style={[styles.safe, !isDark && { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  if (isDark) {
    return (
      <LinearGradient
        colors={["#0B1020", "#141A2E", "#0B1020"]}
        style={{ flex: 1 }}
      >
        {body}
      </LinearGradient>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flexGrow: 1, // ✅ REQUIRED for ScrollView
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  centerContainer: {
    justifyContent: "center",
  },
});
