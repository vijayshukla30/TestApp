import { Text } from "react-native";
import Screen from "../../../components/Screen";

export default function Recording() {
  return (
    <Screen>
      <Text className="text-text text-xl font-semibold mb-4">Recordings</Text>
      {/* Section title */}
      <Text className="text-subText text-xs uppercase tracking-wider mb-2">
        Record Note
      </Text>
    </Screen>
  );
}
