import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={["#0B1020", "#141A2E", "#0B1020"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.centerContainer}>{children}</View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
