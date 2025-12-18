import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function AuthSkeleton() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    alignItems: "center",
  },
});
