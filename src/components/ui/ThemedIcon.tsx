// components/ui/ThemedIcon.tsx
import { useColorScheme } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";

type ThemedIconProps = React.ComponentProps<typeof MaterialIcons> & {
  lightColor?: string;
  darkColor?: string;
};

export default function ThemedIcon({
  name,
  size = 24,
  lightColor = "#6366F1", // your primary
  darkColor = "#8B9CFF", // your dark-primary
  ...props
}: ThemedIconProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <MaterialIcons
      name={name}
      size={size}
      color={isDark ? darkColor : lightColor}
      {...props}
    />
  );
}
