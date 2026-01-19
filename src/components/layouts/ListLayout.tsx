// components/layouts/ListLayout.tsx
import { View, StyleSheet } from "react-native";
import Screen from "../Screen";

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Screen>
      <View style={styles.container}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
});
