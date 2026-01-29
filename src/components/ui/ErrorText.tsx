import { Text } from "react-native";

export default function ErrorText({ message }: { message?: string }) {
  if (!message) return null;

  return <Text className="text-red-400 text-xs mt-1 mb-2">{message}</Text>;
}
