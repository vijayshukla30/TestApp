import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  available: boolean;
};

export default function ToolChip({ label, available }: Props) {
  return (
    <Pressable
      className={`
  px-3.5 py-1.5 rounded-full border
  shadow-sm dark:shadow-md
  ${
    available
      ? "bg-primary/15 dark:bg-dark-primary/25 border-primary/40 dark:border-dark-primary/50"
      : "bg-surface-secondary dark:bg-dark-surface/70 border-border dark:border-dark-border/60"
  }
  active:opacity-85
`}
    >
      <Text
        className={`
          text-xs font-medium
          ${
            available
              ? "text-primary dark:text-dark-primary"
              : "text-subText dark:text-dark-subText"
          }
        `}
      >
        {label}
      </Text>
    </Pressable>
  );
}
