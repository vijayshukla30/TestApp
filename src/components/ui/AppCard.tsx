import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Surface } from "react-native-paper";
import useTheme from "../../hooks/useTheme";

type CardVariant = "default" | "auth";
type CardElevation = 0 | 1 | 2 | 3 | 4 | 5;

type Props = {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  elevation?: CardElevation;
};

export default function AppCard({
  children,
  variant = "default",
  style,
  elevation,
}: Props) {
  const { theme } = useTheme();
  const isAuth = variant === "auth";

  const cardElevation: CardElevation = elevation ?? (isAuth ? 4 : 2);

  return (
    <Surface
      elevation={cardElevation}
      style={[
        styles.base,
        {
          backgroundColor: isAuth ? "rgba(15,20,35,0.9)" : theme.surface,
          borderColor: "rgba(255,255,255,0.08)",
        },
        style,
      ]}
    >
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },
});
