import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
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
            className="mr-3 w-9 h-9 rounded-full bg-primary items-center justify-center"
          >
            <Text className="text-white font-semibold">{initial}</Text>
          </Pressable>
        ),
      }}
    >
      {children}
    </Stack>
  );
}
