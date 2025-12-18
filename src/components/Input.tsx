import { TextInput, StyleSheet } from "react-native";

export default function Input(props: any) {
  return (
    <TextInput
      {...props}
      style={styles.input}
      placeholderTextColor="#999"
      autoCapitalize="none"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 14,
  },
});
