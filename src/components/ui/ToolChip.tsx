import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  available: boolean;
};

export default function ToolChip({ label, available }: Props) {
  return (
    <Pressable
      className={[
        "px-3.5 py-2 rounded-full border",
        available
          ? "bg-emerald-950 border-emerald-400"
          : "bg-red-950 border-red-400",
      ].join(" ")}
    >
      <Text
        className={[
          "text-xs font-medium",
          available ? "text-emerald-300" : "text-red-300",
        ].join(" ")}
      >
        {label}
      </Text>
    </Pressable>
  );
}
