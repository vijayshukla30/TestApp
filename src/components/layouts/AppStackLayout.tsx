import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAppSelector } from "../../hooks/useAppSelector";

export default function AppStackLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector((s: any) => s.auth.user);
  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitle: title,
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
        headerRight: () => (
          <Pressable
            onPress={() => {
              router.push("/settings");
            }}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Text className="text-white font-semibold">{initial}</Text>
            </View>
          </Pressable>
        ),
      }}
    >
      {children}
    </Stack>
  );
}
