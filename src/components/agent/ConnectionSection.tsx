import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import AppCard from "../ui/AppCard";
import useTheme from "../../hooks/useTheme";

type Props = {
  onConnect: () => void;
};

export default function ConnectionSection({ onConnect }: Props) {
  const { theme } = useTheme();

  return (
    <AppCard style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="link" size={36} color={theme.primary} />
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        Platform Connection
      </Text>

      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Connect your platform to enable tools and automation.
      </Text>

      <Button mode="contained" onPress={onConnect} style={styles.button}>
        Connect Platform
      </Button>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: 26,
    marginBottom: 24,
  },

  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(129,140,248,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },

  button: {
    minWidth: 180,
  },
});
