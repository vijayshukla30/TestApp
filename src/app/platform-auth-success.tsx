import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAppDispatch from "../hooks/useAppDispatch";
import useAuth from "../hooks/useAuth";
import { fetchUserActivity } from "../features/activity/activitySlice";

export default function PlatformAuthSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useAuth()!;

  const params = useLocalSearchParams();
  const encodedState = params.state as string | undefined;

  useEffect(() => {
    const run = async () => {
      try {
        if (!encodedState) {
          router.replace("/");
          return;
        }

        const decoded = JSON.parse(atob(decodeURIComponent(encodedState)));

        const { assistantId, isConfigRequired } = decoded;

        // 🔄 Sync install state
        await dispatch(fetchUserActivity({ token }));

        // 🔀 Decide where to go
        if (isConfigRequired) {
          router.replace({
            pathname: "/agents/[agentId]/config",
            params: { agentId: assistantId },
          });
        } else {
          router.replace({
            pathname: "/agents/[agentId]",
            params: { agentId: assistantId },
          });
        }
      } catch (err) {
        console.error("Mobile OAuth callback failed:", err);
        router.replace("/");
      }
    };

    run();
  }, [encodedState, token]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
