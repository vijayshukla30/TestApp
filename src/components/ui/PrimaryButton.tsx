import { Pressable, Text, ActivityIndicator } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full rounded-xl bg-primary py-3 items-center ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Text className="text-black font-bold text-base">{title}</Text>
      )}
    </Pressable>
  );
}
