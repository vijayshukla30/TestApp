import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function Screen({
  children,
  center = false,
  withHeader = false,
  modal = false,
}: {
  children: React.ReactNode;
  center?: boolean;
  withHeader?: boolean;
  modal?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 10;

  return (
    <SafeAreaView
      className={`flex-1 ${modal ? "bg-surface" : "bg-background"}`}
      style={{
        paddingTop: insets.top + (withHeader ? HEADER_HEIGHT : 0),
      }}
    >
      <KeyboardAvoidingView
        className={`flex-1 ${center ? "items-center justify-center px-6" : "px-5"}`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
