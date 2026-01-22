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
  lightColor = "#374151", // black for light mode buttons
  darkColor = "#E5E7EB", // your dark-primary
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
