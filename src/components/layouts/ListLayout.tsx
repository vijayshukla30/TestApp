import { View } from "react-native";
import Screen from "../Screen";

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Screen>
      <View className="flex-1 px-5 pt-3 bg-background dark:bg-dark-background">
        {children}
      </View>
    </Screen>
  );
}
