import { View, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";

export default function AuthSkeleton() {
  return (
    <View className="py-16 items-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
