import { View, StyleSheet } from "react-native";
import AppCard from "../ui/AppCard";

export default function AgentCardSkeleton() {
  return (
    <AppCard style={styles.card}>
      <View style={styles.circle} />
      <View style={styles.line} />
      <View style={styles.smallLine} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "48%",
    alignItems: "center",
    paddingVertical: 20,
    opacity: 0.6,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  line: {
    width: "70%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 6,
  },
  smallLine: {
    width: "50%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
  },
});
