import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAppDispatch from "../hooks/useAppDispatch";
import useAuth from "../hooks/useAuth";
import { fetchUserActivity } from "../features/activity/activitySlice";
import { fetchConsumerByAgent } from "../features/consumer/consumerSlice";
import { decodeAuthState } from "../utils/auth";

export default function PlatformAuthSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useAuth()!;

  const params = useLocalSearchParams();
  console.log("params :>> ", params);
  const encodedState = params.state as string | undefined;
  console.log("encodedState :>> ", encodedState);
  useEffect(() => {
    const run = async () => {
      try {
        if (!encodedState) {
          router.replace("/");
          return;
        }

        const decoded = decodeAuthState(encodedState);
        if (!decoded) {
          router.replace("/");
          return;
        }
        console.log("decoded :>> ", decoded);
        const { assistantId, isConfigRequired, seoName } = decoded;

        // 🔄 Sync install state
        if (token) {
          await dispatch(fetchUserActivity({ token }));
        }

        if (assistantId && seoName && token) {
          await dispatch(
            fetchConsumerByAgent({
              agentId: assistantId,
              seoName,
              token,
            }),
          );
        }
        console.log("isConfigRequired :>> ", isConfigRequired);
        // 🔀 Decide where to go
        if (isConfigRequired) {
          router.replace({
            pathname: "/agents/[agentId]/config",
            params: { agentId: assistantId, cState: encodedState },
          });
        } else {
          router.replace({
            pathname: "/agents/[agentId]",
            params: { agentId: assistantId, cState: encodedState },
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
