import { TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: "none" | "sentences";
};

export default function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
}: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text mb-4"
    />
  );
}
