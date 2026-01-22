import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function Screen({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <KeyboardAvoidingView
        className={`flex-1 ${center ? "items-center justify-center px-6" : "px-5"}`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
