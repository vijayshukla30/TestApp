import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Screen({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { theme } = themeContext;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, center && styles.center]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  center: {
    justifyContent: "center",
  },
});
