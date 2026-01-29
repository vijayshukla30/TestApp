import { View } from "react-native";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <View
      className={`rounded-2xl bg-surface border border-border shadow-lg ${className}`}
    >
      {children}
    </View>
  );
}
