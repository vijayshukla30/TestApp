import { Text, StyleSheet, Pressable } from "react-native";
import useTheme from "../../hooks/useTheme";

type Props = {
  label: string;
  available: boolean;
};

export default function ToolChip({ label, available }: Props) {
  const { theme } = useTheme();

  const bg = available ? "#0F2F1E" : "#2B1A1A";
  const border = available ? "#4ADE80" : "#F87171";
  const text = available ? "#86EFAC" : "#FCA5A5";

  return (
    <Pressable
      style={[
        styles.chip,
        {
          backgroundColor: bg,
          borderColor: border,
        },
      ]}
    >
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
  },
});
