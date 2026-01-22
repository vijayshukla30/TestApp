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
      className="
    w-full rounded-xl
    border border-border dark:border-dark-border
    bg-surface dark:bg-dark-surface
    px-4 py-3.5
    text-text dark:text-dark-text
    text-[15px]
    placeholder:text-subText dark:placeholder:text-dark-subText
    focus:border-primary dark:focus:border-dark-primary
    focus:ring-1 focus:ring-primary/30 dark:focus:ring-dark-primary/30
    mb-4
  "
    />
  );
}
