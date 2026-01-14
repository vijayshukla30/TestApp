import { Agent } from "../types/agent";
import { handlePlatformAuth } from "../utils/platformAuth";
import useAppDispatch from "./useAppDispatch";
import {
  deleteConsumer,
  upsertConsumer,
} from "../features/consumer/consumerSlice";
import useAuth from "./useAuth";
import { createUserActivity } from "../features/activity/activitySlice";

export const usePlatformConnection = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAuth();

  const connectPlatform = async (agent: Agent, consumer: any | null) => {
    if (!agent || !token || !user) return;

    let consumerToUse = consumer;

    // 1️⃣ Ensure consumer exists
    if (!consumerToUse) {
      const res = await dispatch(
        upsertConsumer({
          agentId: agent.uuid,
          seoName: agent.seoName,
          token,
          data: {
            name: user.name,
            email: user.email,
            accountId: user.org,
            userId: user.uuid,
            phoneNumber: user.phoneNumber,
            assistantId: agent.uuid,
          },
        })
      ).unwrap();

      consumerToUse = res.consumer;
    }

    if (!consumerToUse?.uuid) {
      throw new Error("Consumer not ready for auth");
    }

    // 2️⃣ Platform auth (opens browser)
    await handlePlatformAuth({
      assistant: agent,
      consumer: consumerToUse,
    });

    // 3️⃣ Activity AFTER auth
    await dispatch(
      createUserActivity({
        assistantUuid: agent.uuid,
        isInstalled: true,
        token,
      })
    ).unwrap();
  };
  const disconnectPlatform = async (agent: Agent) => {
    if (!agent || !token) return;

    await dispatch(
      deleteConsumer({
        agentId: agent.uuid,
        seoName: agent.seoName,
        token,
      })
    ).unwrap();

    await dispatch(
      createUserActivity({
        assistantUuid: agent.uuid,
        isInstalled: false,
        token,
      })
    ).unwrap();
  };

  return { connectPlatform, disconnectPlatform };
};
