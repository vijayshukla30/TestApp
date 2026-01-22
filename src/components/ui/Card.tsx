import { View } from "react-native";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
};

export default function Card({
  children,
  className = "",
  variant = "default",
  ...props
}: Props) {
  const baseClasses = `
    rounded-2xl
    bg-surface dark:bg-dark-surface
    border border-border dark:border-dark-border
  `;

  const variantStyles = {
    default: "shadow-sm dark:shadow-md",
    elevated: "shadow-lg dark:shadow-xl",
    outlined: "border-2 border-border dark:border-dark-border shadow-none",
  };
  return (
    <View
      className={`
        ${baseClasses}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
}
